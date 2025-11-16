import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'
import PermissionRoute from './components/PermissionRoute'
import FloatingChatButton from './components/FloatingChatButton'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Mentorship from './pages/Mentorship'
import MentorshipDetails from './pages/MentorshipDetails'
import CreateMentorship from './pages/CreateMentorship'
import FindMentors from './pages/FindMentors'
import FindMentorsForMentorship from './pages/FindMentorsForMentorship'
import Settings from './pages/Settings'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - redirect to dashboard if logged in */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          {/* Auth Routes - redirect to dashboard if already logged in */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Onboarding - accessible only to authenticated users who haven't completed it */}
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Protected Routes - require authentication and completed onboarding */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Mentorship routes - accessible to all authenticated users */}
          <Route 
            path="/mentorship" 
            element={
              <ProtectedRoute>
                <Mentorship />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mentorship/:id" 
            element={
              <ProtectedRoute>
                <MentorshipDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mentorship/:id/find-mentors" 
            element={
              <ProtectedRoute>
                <PermissionRoute permission="canCreateMentorship">
                  <FindMentorsForMentorship />
                </PermissionRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-mentorship" 
            element={
              <ProtectedRoute>
                <PermissionRoute permission="canCreateMentorship">
                  <CreateMentorship />
                </PermissionRoute>
              </ProtectedRoute>
            } 
          />
          
          {/* FindMentors is now only accessible through the CreateMentorship wizard */}
          {/* <Route path="/find-mentors" element={<ProtectedRoute><FindMentors /></ProtectedRoute>} /> */}
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
        
        {/* Global Floating Chat Button - Available for all authenticated users */}
        <FloatingChatButton />
      </Router>
    </AuthProvider>
  )
}

export default App
