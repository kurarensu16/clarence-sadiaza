import { supabase } from '../lib/supabase'

// Default content structure (used when initializing database)
const getDefaultContent = () => ({
  hero: {
    name: 'Clarence Sadiaza',
    location: 'Bulacan, Central Luzon, Philippines',
    title: 'Information Technology Student | Aspiring Full-Stack Developer',
    email: 'sadiazaclarence@gmail.com'
  },
  about: {
    paragraphs: [
      "I'm an Information Technology student with a passion for creating clean, intuitive digital experiences. Currently pursuing my degree while building personal projects and learning modern web development technologies.",
      "My focus is on full-stack development with modern technologies like React, Node.js, and cloud platforms. I enjoy turning ideas into functional applications and continuously learning new technologies to stay current with industry trends.",
      "Beyond academics, I'm passionate about contributing to open-source projects and building a strong foundation in software engineering principles. I'm always eager to learn and grow in the tech community."
    ]
  },
  experience: [
    {
      year: '2023-present',
      title: 'Information Technology Student',
      company: 'Dr. Yanga\'s Colleges',
      description: 'Currently pursuing Bachelor of Science in Information Technology with focus on software development, database management, and IT systems. Maintaining high academic performance while building personal projects.'
    },
    {
      year: '2022-2023',
      title: 'Self-Taught Developer',
      company: 'Online Learning',
      description: 'Completed multiple online courses in web development including React, Node.js, and modern JavaScript. Built various personal projects to practice and showcase skills.'
    },
    {
      year: '2022',
      title: 'High School Graduate',
      company: 'Japan–Philippines Institute of Technology',
      description: 'Graduated in Technical-Vocational Track(ICT), and developed interest in programming through basic web development projects.'
    }
  ],
  skills: {
    frontend: ['JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'HTML5', 'CSS3', 'Sass', 'Webpack', 'Vite'],
    backend: ['Node.js', 'Express', 'Python', 'MySQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Supabase']
  },
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A fully responsive e-commerce website with product filtering, cart functionality, and secure checkout process.",
      tags: ["React", "Node.js", "MongoDB", "PayMongo"],
      year: "2024",
      url: "https://github.com/kurarensu16/ecommerce-platform"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A productivity application for managing tasks with drag-and-drop functionality and real-time collaboration.",
      tags: ["React", "Firebase", "Material UI", "Redux"],
      year: "2023",
      url: "https://github.com/kurarensu16/task-management-app"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Real-time weather application with 5-day forecast, location search, and interactive maps integration.",
      tags: ["JavaScript", "REST API", "CSS3", "Leaflet"],
      year: "2023",
      url: "https://github.com/kurarensu16/weather-dashboard"
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "A minimalist portfolio website showcasing projects and skills with smooth animations and responsive design.",
      tags: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
      year: "2024",
      url: "https://github.com/kurarensu16/portfolio-website"
    }
  ],
  contact: {
    email: 'sadiazaclarence@gmail.com',
    location: 'Bulacan, Central Luzon, Philippines',
    availability: 'Available for freelance work',
    social: {
      github: 'https://github.com/kurarensu16',
      linkedin: 'https://www.linkedin.com/in/clarence-sadiaza-16770b387/',
      facebook: 'https://www.facebook.com/profile.php?id=61580149517159'
    }
  },
  chat: {
    enabled: true,
    buttonText: "Chat with Clarence",
    placeholder: "Type a message...",
    autoResponses: [
      {
        trigger: ["hello", "hi", "hey"],
        response: "Hello! 👋 Thanks for visiting my portfolio. How can I help you today?"
      },
      {
        trigger: ["about", "who are you", "tell me about yourself"],
        response: "I'm Clarence Sadiaza, an Information Technology student passionate about full-stack development. I love creating clean, intuitive digital experiences with modern technologies like React, Node.js, and cloud platforms."
      },
      {
        trigger: ["projects", "work", "portfolio"],
        response: "I've worked on several projects including an E-Commerce Platform, Task Management App, Weather Dashboard, and this Portfolio Website. You can click on any project card to view the source code on GitHub!"
      },
      {
        trigger: ["skills", "technologies", "tech stack"],
        response: "My tech stack includes React, JavaScript, TypeScript, Node.js, MongoDB, PostgreSQL, AWS, and many more. I'm always learning new technologies to stay current with industry trends."
      },
      {
        trigger: ["contact", "email", "reach out"],
        response: "You can reach me at sadiazaclarence@gmail.com or connect with me on LinkedIn and GitHub. I'm always interested in new opportunities and exciting projects!"
      },
      {
        trigger: ["experience", "background", "education"],
        response: "I'm currently pursuing my Bachelor's in Information Technology at Dr. Yanga's Colleges. I've been self-teaching web development since 2022 and have built various personal projects to practice my skills."
      }
    ],
    fallbackResponse: "That's interesting! I'm always eager to learn and discuss new topics. Feel free to ask me about my projects, skills, or experiences in tech. You can also check out my GitHub repositories for more details!"
  }
})

// Get portfolio content for the current user
export const getPortfolioContent = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // For public portfolio view, try to get content without user
      // This requires a public read policy or a service role key
      const { data, error } = await supabase
        .from('portfolio_content')
        .select('content')
        .limit(1)
        .single()
      
      if (error || !data) {
        return null
      }
      return data?.content || null
    }

    const { data, error } = await supabase
      .from('portfolio_content')
      .select('content')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No content found, create default content
        const defaultContent = getDefaultContent()
        await updatePortfolioContent(defaultContent)
        return defaultContent
      }
      throw error
    }

    return data?.content || null
  } catch (error) {
    console.error('Error fetching portfolio content:', error)
    throw error
  }
}

// Update portfolio content
export const updatePortfolioContent = async (content) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }
  
      const { data, error } = await supabase
        .from('portfolio_content')
        .upsert({
          user_id: user.id,
          content: content,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single()
  
      if (error) throw error
  
      return data
    } catch (error) {
      console.error('Error updating portfolio content:', error)
      throw error
    }
  }
  
  // Subscribe to portfolio content changes
  export const subscribeToPortfolioContent = async (callback) => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        console.warn('User not authenticated, subscription not created')
        return null
      }

      const subscription = supabase
        .channel('portfolio_content_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'portfolio_content',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            callback(payload.new?.content || null)
          }
        )
        .subscribe()

      return subscription
    } catch (error) {
      console.error('Error setting up portfolio content subscription:', error)
      return null
    }
  }