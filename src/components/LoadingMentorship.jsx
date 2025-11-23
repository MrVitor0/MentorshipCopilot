import Card from './Card'

export default function LoadingMentorship() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} hover padding="md" gradient className="animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-8 w-16 bg-neutral-300 rounded-lg"></div>
                <div className="h-4 w-28 bg-neutral-300 rounded-lg"></div>
              </div>
              <div className="w-10 h-10 bg-neutral-300 rounded-[12px]"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card padding="md" className="animate-pulse">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-neutral-300 rounded-[12px]"></div>
            ))}
          </div>
          <div className="w-full md:w-64 h-10 bg-neutral-300 rounded-[12px]"></div>
        </div>
      </Card>

      {/* Mentorships Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} hover padding="none" className="overflow-hidden animate-pulse">
            {/* Header */}
            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 p-6 border-b border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-neutral-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-32 bg-neutral-300 rounded-lg"></div>
                  <div className="h-4 w-24 bg-neutral-300 rounded-lg"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-neutral-300 rounded-full"></div>
                    <div className="h-6 w-16 bg-neutral-300 rounded-full"></div>
                    <div className="h-6 w-16 bg-neutral-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-white space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-neutral-300 rounded-lg"></div>
                  <div className="h-4 w-12 bg-neutral-300 rounded-lg"></div>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-neutral-300 rounded-full"></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="p-3 bg-neutral-100 rounded-[12px] space-y-2">
                    <div className="h-4 w-4 bg-neutral-300 rounded mx-auto"></div>
                    <div className="h-6 w-8 bg-neutral-300 rounded mx-auto"></div>
                    <div className="h-3 w-16 bg-neutral-300 rounded mx-auto"></div>
                  </div>
                ))}
              </div>

              {/* Challenge */}
              <div className="space-y-2">
                <div className="h-4 w-20 bg-neutral-300 rounded-lg"></div>
                <div className="p-3 bg-neutral-100 rounded-[12px]">
                  <div className="h-3 w-full bg-neutral-300 rounded-lg mb-2"></div>
                  <div className="h-3 w-3/4 bg-neutral-300 rounded-lg"></div>
                </div>
              </div>

              {/* Button */}
              <div className="h-12 bg-neutral-300 rounded-[14px]"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-[16px] shadow-lg border border-neutral-200">
          <div className="w-5 h-5 border-3 border-baires-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-neutral-gray-dark font-medium">Loading mentorships...</span>
        </div>
      </div>
    </div>
  )
}

