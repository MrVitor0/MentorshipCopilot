import Card from './Card'

export default function LoadingMentorshipDetails() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-48 bg-neutral-300 rounded-lg"></div>
        <div className="h-6 w-64 bg-neutral-300 rounded-lg"></div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mentee Info Card Skeleton */}
          <Card padding="lg" className="animate-pulse">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-neutral-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="h-8 w-48 bg-neutral-300 rounded-lg"></div>
                  <div className="h-5 w-32 bg-neutral-300 rounded-lg"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-20 bg-neutral-300 rounded-full"></div>
                  <div className="h-7 w-20 bg-neutral-300 rounded-full"></div>
                  <div className="h-7 w-20 bg-neutral-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Progress Card Skeleton */}
          <Card padding="lg" className="animate-pulse">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-neutral-300 rounded-lg"></div>
              <div className="h-3 bg-neutral-200 rounded-full">
                <div className="h-full w-3/5 bg-neutral-300 rounded-full"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-neutral-100 rounded-[16px] space-y-3">
                    <div className="h-5 w-5 bg-neutral-300 rounded mx-auto"></div>
                    <div className="h-8 w-12 bg-neutral-300 rounded mx-auto"></div>
                    <div className="h-4 w-20 bg-neutral-300 rounded mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Sessions History Skeleton */}
          <Card padding="lg" className="animate-pulse">
            <div className="space-y-4">
              <div className="h-6 w-40 bg-neutral-300 rounded-lg"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-neutral-100 rounded-[16px] space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-neutral-300 rounded-lg"></div>
                        <div className="h-4 w-24 bg-neutral-300 rounded-lg"></div>
                      </div>
                      <div className="h-6 w-20 bg-neutral-300 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-neutral-300 rounded-lg"></div>
                      <div className="h-3 w-4/5 bg-neutral-300 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Status Card Skeleton */}
          <Card padding="lg" className="animate-pulse">
            <div className="space-y-4">
              <div className="h-6 w-24 bg-neutral-300 rounded-lg"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-neutral-300 rounded-lg"></div>
                    <div className="h-4 w-32 bg-neutral-300 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Goals Card Skeleton */}
          <Card padding="lg" className="animate-pulse">
            <div className="space-y-4">
              <div className="h-6 w-28 bg-neutral-300 rounded-lg"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-neutral-300 rounded flex-shrink-0 mt-0.5"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full bg-neutral-300 rounded-lg"></div>
                      <div className="h-3 w-3/4 bg-neutral-300 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Action Buttons Skeleton */}
          <div className="space-y-3 animate-pulse">
            <div className="h-12 bg-neutral-300 rounded-[14px]"></div>
            <div className="h-12 bg-neutral-300 rounded-[14px]"></div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-[16px] shadow-lg border border-neutral-200">
          <div className="w-5 h-5 border-3 border-baires-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-neutral-gray-dark font-medium">Loading mentorship details...</span>
        </div>
      </div>
    </div>
  )
}

