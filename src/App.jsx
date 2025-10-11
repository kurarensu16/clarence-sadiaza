import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import CMS from './components/CMS'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
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