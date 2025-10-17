import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          About MentorshipCopilot
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-700 mb-4">
            MentorshipCopilot is an AI-powered platform designed to streamline 
            the BairesDev mentorship program.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Our features include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>Smart mentor matching</li>
            <li>Centralized progress tracking</li>
            <li>Automated scheduling</li>
            <li>Performance analytics</li>
          </ul>
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
