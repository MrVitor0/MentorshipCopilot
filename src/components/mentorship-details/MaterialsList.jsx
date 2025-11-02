import { FileText, Image as ImageIcon, Link as LinkIcon, Video, FolderOpen, Download, ExternalLink } from 'lucide-react'
import Card from '../Card'

const MATERIAL_ICONS = {
  pdf: FileText,
  image: ImageIcon,
  link: LinkIcon,
  video: Video
}

const MATERIAL_COLORS = {
  pdf: 'from-red-500 to-red-600',
  image: 'from-purple-500 to-purple-600',
  link: 'from-blue-500 to-blue-600',
  video: 'from-pink-500 to-pink-600',
  default: 'from-neutral-500 to-neutral-600'
}

export default function MaterialsList({ materials = [], title = "Learning Materials", description = null, showEmpty = true }) {
  return (
    <Card padding="lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
          <FolderOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-black">{title}</h2>
          <p className="text-sm text-neutral-gray-dark">
            {description || `${materials.length} resource${materials.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      {materials.length > 0 ? (
        <div className="space-y-3">
          {materials.map((material) => {
            const Icon = MATERIAL_ICONS[material.type] || FileText
            const colorClass = MATERIAL_COLORS[material.type] || MATERIAL_COLORS.default

            return (
              <Card key={material.id} padding="md" hover className="bg-gradient-to-br from-white to-neutral-50">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-[12px] bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neutral-black mb-1">{material.title}</h3>
                    {material.description && (
                      <p className="text-sm text-neutral-gray-dark mb-2 line-clamp-2">{material.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-neutral-gray-dark">
                      <span>Added by {material.addedBy}</span>
                      <span>•</span>
                      <span>{material.addedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      {material.downloads > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {material.downloads}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-[12px] font-semibold hover:shadow-md transition-all flex items-center gap-2 flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </a>
                </div>
              </Card>
            )
          })}
        </div>
      ) : showEmpty ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="text-lg font-bold text-neutral-black mb-2">No Materials Yet</h4>
          <p className="text-sm text-neutral-gray-dark mb-4">
            Learning materials will appear here once shared
          </p>
        </div>
      ) : null}
    </Card>
  )
}

