import { AlertCircle } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function DefaultView({ navigate }) {
  return (
    <Card padding="xl" className="text-center">
      <div className="py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-neutral-gray-dark" />
        </div>
        <h3 className="text-xl font-bold text-neutral-black mb-2">Access Denied</h3>
        <p className="text-neutral-gray-dark mb-6">
          You don&apos;t have permission to view this mentorship
        </p>
        <Button variant="orange" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </Card>
  )
}

