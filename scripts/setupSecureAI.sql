-- Enable HTTP extension to make HTTP calls from PostgreSQL database
create extension if not exists http;

-- Create private settings table for storing keys securely
create table if not exists private_settings (
  key text primary key,
  value text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) on private settings table
alter table private_settings enable row level security;

-- Keep it private: DO NOT add any read policies for public/anon roles.
-- This ensures only database admin roles (and security definer functions) can read it.

-- Create function to save the API key securely (Only authenticated owners/admins can save keys)
create or replace function set_openrouter_api_key(key_value text)
returns void
language plpgsql
security definer
as $$
begin
  -- Check if the current user is authenticated
  if auth.role() = 'authenticated' then
    insert into private_settings (key, value, updated_at) 
    values ('openrouter_api_key', key_value, now())
    on conflict (key) do update set value = excluded.value, updated_at = now();
  else
    raise exception 'Unauthorized';
  end if;
end;
$$;

-- Create function to check if the API key is active without exposing it
create or replace function has_openrouter_api_key()
returns boolean
language plpgsql
security definer
as $$
declare
  api_key text;
begin
  -- Check if the current user is authenticated
  if auth.role() = 'authenticated' then
    select value from private_settings where key = 'openrouter_api_key' into api_key;
    return api_key is not null and api_key <> '';
  else
    return false;
  end if;
end;
$$;

-- Create function to fetch AI completion directly via OpenRouter
create or replace function get_ai_response(user_message text)
returns text
language plpgsql
security definer
as $$
declare
  api_key text;
  portfolio_data jsonb;
  name text;
  title text;
  about text;
  skills text;
  experience text;
  projects text;
  certifications text;
  email text;
  system_prompt text;
  payload_json_text text;
  response_content text;
begin
  -- Increase HTTP curl request transfer timeout to 30s and connection timeout to 10s
  perform set_config('http.curlopt_timeout_ms', '30000', true);
  perform set_config('http.curlopt_connecttimeout_ms', '10000', true);

  -- Get the OpenRouter API Key securely from private settings
  select value from private_settings where key = 'openrouter_api_key' into api_key;
  
  -- If no API key is set, return null (so client falls back to keyword matching)
  if api_key is null or api_key = '' then
    return null;
  end if;

  -- Load the latest portfolio content to populate system prompt dynamically
  select content::jsonb from portfolio_content order by updated_at desc limit 1 into portfolio_data;
  
  -- Extract details with fallback defaults
  name := coalesce(portfolio_data->'hero'->>'name', 'Clarence Timothy Sadiaza');
  title := coalesce(portfolio_data->'hero'->>'title', 'Software Engineer');
  about := coalesce((
    select string_agg(val, ' ') 
    from jsonb_array_elements_text(coalesce(portfolio_data->'about'->'paragraphs', '[]'::jsonb)) as val
  ), '');
  skills := coalesce((portfolio_data->'skills')::text, '{}');
  experience := coalesce((portfolio_data->'experience')::text, '[]');
  projects := coalesce((portfolio_data->'projects')::text, '[]');
  certifications := coalesce((portfolio_data->'certifications')::text, '[]');
  email := coalesce(portfolio_data->'hero'->>'email', 'sadiazaclarence@gmail.com');

  -- Build system prompt
  system_prompt := 'You are the AI Assistant chatbot on Clarence Timothy Sadiaza''s portfolio website. ' ||
                   'Answer questions briefly and professionally on behalf of Clarence. Keep responses under 3 sentences. ' ||
                   'If you don''t know something or if it is not in the resume, say you will check and let him know, or tell them to email him at ' || email || '. ' ||
                   'Resume Details: ' ||
                   'Name: ' || name || ' | ' ||
                   'Title: ' || title || ' | ' ||
                   'About: ' || about || ' | ' ||
                   'Skills: ' || skills || ' | ' ||
                   'Experience: ' || experience || ' | ' ||
                   'Projects: ' || projects || ' | ' ||
                   'Certifications: ' || certifications || ' | ' ||
                   'Email: ' || email;

  -- Construct JSON request body securely
  payload_json_text := json_build_object(
    'model', 'poolside/laguna-m.1:free',
    'messages', json_build_array(
      json_build_object('role', 'system', 'content', system_prompt),
      json_build_object('role', 'user', 'content', user_message)
    )
  )::text;

  -- Call OpenRouter completion endpoint via http extension
  begin
    select 
      (response.content::json->'choices'->0->'message'->>'content')
    from http((
      'POST',
      'https://openrouter.ai/api/v1/chat/completions',
      array[
        http_header('Authorization', 'Bearer ' || api_key),
        http_header('Content-Type', 'application/json'),
        http_header('HTTP-Referer', 'https://clarence-sadiaza.vercel.app')
      ],
      'application/json',
      payload_json_text
    )::http_request) as response
    into response_content;
  exception when others then
    return null;
  end;

  return response_content;
end;
$$;
