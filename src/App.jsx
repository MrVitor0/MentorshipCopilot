import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Mentorship from './pages/Mentorship'
import MentorshipDetails from './pages/MentorshipDetails'
import CreateMentorship from './pages/CreateMentorship'
import FindMentors from './pages/FindMentors'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/mentorship/:id" element={<MentorshipDetails />} />
        <Route path="/create-mentorship" element={<CreateMentorship />} />
        <Route path="/find-mentors" element={<FindMentors />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
