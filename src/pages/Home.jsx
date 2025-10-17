import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          MentorshipCopilot
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          An AI-powered CoPilot to streamline the BairesDev mentorship program
        </p>
        <div className="space-x-4">
          <Link 
            to="/about" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}
