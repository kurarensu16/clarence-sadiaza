# Portfolio CMS (Content Management System)

## Overview
This is a frontend-first Content Management System for the Clarence Sadiaza portfolio website. It allows you to edit all portfolio content through a user-friendly interface.

## Features

### 🔐 Authentication
- Simple login system with username/password
- Demo credentials: `admin` / `admin123`
- Protected routes that require authentication
- Session persistence using localStorage

### 📝 Content Management
The CMS allows you to edit all sections of the portfolio:

1. **Hero Section**
   - Name, location, title, and email
   - Profile information display

2. **About Section**
   - Multiple paragraphs of personal description
   - Add/remove paragraphs dynamically

3. **Experience Section**
   - Add/edit/remove work experience entries
   - Year, title, company, and description fields

4. **Skills Section**
   - Frontend technologies list
   - Backend technologies list
   - Add/remove skills dynamically

5. **Projects Section**
   - Add/edit/remove project entries
   - Title, description, tags, and year fields
   - Comma-separated tags input

6. **Contact Section**
   - Email, location, availability status
   - Social media links (GitHub, LinkedIn, Facebook)

### 💾 Data Persistence
- All content is saved to browser localStorage
- Changes persist across browser sessions
- Real-time updates on the main portfolio page

### 🎨 User Interface
- Clean, modern admin interface
- Tabbed navigation for different sections
- Responsive design that works on all devices
- Dark/light theme support
- Save confirmation messages

## How to Use

### Accessing the CMS
1. Visit the main portfolio page
2. Click the "CMS" button in the top-right corner
3. Login with the demo credentials: `admin` / `admin123`

### Editing Content
1. Select a section from the left sidebar
2. Edit the fields in the main content area
3. Click "Save Changes" to persist your edits
4. Changes will immediately appear on the main portfolio page

### Navigation
- Use the sidebar tabs to switch between sections
- Each section has its own editing interface
- The "Save Changes" button saves all current edits

## Technical Details

### Architecture
- **Frontend**: React 19 with React Router
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: React hooks (useState, useEffect)
- **Data Storage**: Browser localStorage
- **Authentication**: Simple client-side authentication

### File Structure
```
src/components/
├── Login.jsx          # Authentication component
├── CMS.jsx           # Main CMS dashboard
├── ProtectedRoute.jsx # Route protection wrapper
├── Layout.jsx        # Updated with CMS link
├── Hero.jsx          # Updated to use dynamic content
├── About.jsx         # Updated to use dynamic content
├── Experience.jsx    # Updated to use dynamic content
├── Projects.jsx      # Updated to use dynamic content
└── Contact.jsx       # Updated to use dynamic content
```

### Data Structure
The portfolio content is stored in localStorage under the key `portfolioContent` with the following structure:

```json
{
  "hero": {
    "name": "Clarence Sadiaza",
    "location": "Bulacan, Central Luzon, Philippines",
    "title": "Information Technology Student | Aspiring Full-Stack Developer",
    "email": "sadiazaclarence@gmail.com"
  },
  "about": {
    "paragraphs": ["paragraph 1", "paragraph 2", ...]
  },
  "experience": [
    {
      "year": "2023-present",
      "title": "Information Technology Student",
      "company": "Dr. Yanga's Colleges",
      "description": "..."
    }
  ],
  "skills": {
    "frontend": ["React", "JavaScript", ...],
    "backend": ["Node.js", "MongoDB", ...]
  },
  "projects": [
    {
      "id": 1,
      "title": "Project Name",
      "description": "...",
      "tags": ["React", "Node.js"],
      "year": "2024"
    }
  ],
  "contact": {
    "email": "sadiazaclarence@gmail.com",
    "location": "Bulacan, Central Luzon, Philippines",
    "availability": "Available for freelance work",
    "social": {
      "github": "https://github.com/...",
      "linkedin": "https://linkedin.com/...",
      "facebook": "https://facebook.com/..."
    }
  }
}
```

## Security Notes
- This is a frontend-only implementation for demonstration purposes
- In production, you would want to implement proper backend authentication
- Consider using environment variables for sensitive configuration
- Implement proper data validation and sanitization

## Future Enhancements
- Image upload functionality for profile pictures
- Rich text editor for descriptions
- Preview mode before saving changes
- Export/import functionality for content backup
- User roles and permissions
- Real-time collaboration features
- API integration for backend storage
