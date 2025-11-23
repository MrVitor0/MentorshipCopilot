import { FileText, Download } from 'lucide-react'
import Card from '../Card'

export default function SupportMaterialsCard({ 
  materials = []
}) {
  const colorClasses = {
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-indigo-500',
    orange: 'from-indigo-500 to-indigo-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600'
  }

  return (
    <Card gradient hover padding="lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-[16px] flex items-center justify-center shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-neutral-black">Support Materials</h3>
          <p className="text-xs text-neutral-gray-dark">Curated resources for your learning</p>
        </div>
      </div>

      <div className="grid gap-3">
        {materials.map((material, index) => {
          const IconComponent = material.icon
          return (
            <button
              key={index}
              className="group flex items-center gap-4 p-4 bg-gradient-to-br from-white to-green-50/50 rounded-[16px] border border-green-100/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left"
              onClick={() => {
                // Add download logic here
                console.log('Download:', material.title)
              }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[material.color]} rounded-[12px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-neutral-black text-sm">{material.title}</h4>
                <p className="text-xs text-neutral-gray-dark mt-0.5">
                  {material.type} • {material.size}
                </p>
              </div>
              <Download className="w-5 h-5 text-neutral-gray group-hover:text-green-600 transition-colors" />
            </button>
          )
        })}
      </div>
    </Card>
  )
}
