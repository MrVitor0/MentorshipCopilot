import Card from './Card'

export default function LoadingSettings() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse space-y-3">
        <div className="h-10 w-48 bg-neutral-300 rounded-lg"></div>
        <div className="h-5 w-64 bg-neutral-300 rounded-lg"></div>
      </div>

      {/* Profile Picture Card Skeleton */}
      <Card gradient padding="lg" className="animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-neutral-300 rounded"></div>
          <div className="h-6 w-32 bg-neutral-300 rounded-lg"></div>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-neutral-300 rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 w-32 bg-neutral-300 rounded-lg"></div>
            <div className="h-12 bg-neutral-300 rounded-[14px]"></div>
            <div className="h-3 w-full bg-neutral-300 rounded-lg"></div>
          </div>
        </div>
      </Card>

      {/* Basic Information Card Skeleton */}
      <Card gradient padding="lg" className="animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-neutral-300 rounded"></div>
          <div className="h-6 w-40 bg-neutral-300 rounded-lg"></div>
        </div>

        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-neutral-300 rounded-lg"></div>
              <div className="h-12 bg-neutral-300 rounded-[14px]"></div>
              {i > 1 && <div className="h-3 w-40 bg-neutral-300 rounded-lg"></div>}
            </div>
          ))}
        </div>
      </Card>

      {/* Bio Card Skeleton */}
      <Card gradient padding="lg" className="animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-neutral-300 rounded"></div>
          <div className="h-6 w-16 bg-neutral-300 rounded-lg"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-36 bg-neutral-300 rounded-lg"></div>
          <div className="h-32 bg-neutral-300 rounded-[14px]"></div>
          <div className="h-3 w-32 bg-neutral-300 rounded-lg"></div>
        </div>
      </Card>

      {/* Action Buttons Skeleton */}
      <div className="flex justify-end gap-3 animate-pulse">
        <div className="h-12 w-24 bg-neutral-300 rounded-[14px]"></div>
        <div className="h-12 w-36 bg-neutral-300 rounded-[14px]"></div>
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-[16px] shadow-lg border border-neutral-200">
          <div className="w-5 h-5 border-3 border-baires-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-neutral-gray-dark font-medium">Loading settings...</span>
        </div>
      </div>
    </div>
  )
}

