import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import CMS from './components/CMS'
import ProtectedRoute from './components/ProtectedRoute'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Stack from './components/Stack'
import Certifications from './components/Certifications'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<About />} />
        <Route path="/stack" element={<Stack />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/cms" 
        element={
          <ProtectedRoute>
            <CMS />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default App