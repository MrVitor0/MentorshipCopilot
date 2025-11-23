import Card from '../Card'

export default function LoadingDashboard() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Loading Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Hero Skeleton */}
        <Card padding="none" className="lg:col-span-2 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 border-none shadow-lg h-[400px]">
          <div className="relative h-full">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-neutral-300/30 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative p-8 md:p-12 h-full flex flex-col justify-center">
              <div className="animate-pulse space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-neutral-300 rounded-[18px]"></div>
                  <div className="h-4 w-40 bg-neutral-300 rounded-lg"></div>
                </div>
                
                <div className="space-y-3">
                  <div className="h-12 w-3/4 bg-neutral-300 rounded-lg"></div>
                  <div className="h-6 w-full max-w-2xl bg-neutral-300 rounded-lg"></div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-14 w-64 bg-neutral-300 rounded-[16px]"></div>
                  <div className="h-14 w-48 bg-neutral-300/70 rounded-[16px]"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions Skeleton */}
        <Card padding="lg" className="bg-gradient-to-br from-neutral-50 via-white to-neutral-100 border-2 border-neutral-200 h-[400px]">
          <div className="animate-pulse space-y-4 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-neutral-300 rounded-[14px]"></div>
              <div className="h-6 w-32 bg-neutral-300 rounded-lg"></div>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-neutral-200 rounded-[16px] h-20"></div>
              <div className="p-4 bg-neutral-200 rounded-[16px] h-20"></div>
              <div className="p-4 bg-neutral-200 rounded-[16px] h-20"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Second Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} padding="lg" className="animate-pulse">
            <div className="space-y-3">
              <div className="w-14 h-14 bg-neutral-300 rounded-[18px]"></div>
              <div className="h-6 w-24 bg-neutral-300 rounded-lg"></div>
              <div className="h-4 w-full bg-neutral-300 rounded-lg"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-[16px] shadow-lg border border-neutral-200">
          <div className="w-5 h-5 border-3 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-neutral-gray-dark font-medium">Loading your dashboard...</span>
        </div>
      </div>
    </div>
  )
}
