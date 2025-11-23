import Card from './Card'

export default function LoadingTeams() {
  return (
    <div className="space-y-6">
      {/* Stats Header Card Skeleton */}
      <Card className="animate-pulse" padding="md" gradient>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-neutral-300 rounded-[20px]"></div>
            <div className="space-y-2">
              <div className="h-8 w-32 bg-neutral-300 rounded-lg"></div>
              <div className="h-4 w-48 bg-neutral-300 rounded-lg"></div>
            </div>
          </div>
          <div className="h-12 w-36 bg-neutral-300 rounded-[14px]"></div>
        </div>
      </Card>

      {/* Search and Filters Skeleton */}
      <Card padding="md" className="animate-pulse">
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-neutral-300 rounded-[14px]"></div>
          <div className="h-12 w-12 bg-neutral-300 rounded-[14px]"></div>
        </div>
      </Card>

      {/* Teams Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} hover padding="md" className="group animate-pulse">
            <div className="flex flex-col h-full space-y-4">
              {/* Team Header */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-neutral-300 rounded-[16px] flex-shrink-0"></div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-5 w-32 bg-neutral-300 rounded-lg"></div>
                  <div className="h-4 w-full bg-neutral-300 rounded-lg"></div>
                  <div className="h-4 w-3/4 bg-neutral-300 rounded-lg"></div>
                </div>
              </div>

              {/* Team Stats */}
              <div className="flex items-center gap-4 p-3 bg-neutral-100 rounded-[14px]">
                <div className="h-4 w-24 bg-neutral-300 rounded-lg"></div>
                <div className="h-4 w-20 bg-neutral-300 rounded-lg"></div>
              </div>

              {/* Actions */}
              <div className="mt-auto flex gap-2">
                <div className="flex-1 h-10 bg-neutral-300 rounded-[12px]"></div>
                <div className="w-10 h-10 bg-neutral-300 rounded-[12px]"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-[16px] shadow-lg border border-neutral-200">
          <div className="w-5 h-5 border-3 border-baires-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-neutral-gray-dark font-medium">Loading teams...</span>
        </div>
      </div>
    </div>
  )
}

