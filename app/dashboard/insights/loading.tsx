export default function InsightsLoading() {
  return (
    <div className="min-h-screen max-w-lg mx-auto pb-28" style={{ background: 'var(--bg-primary)' }}>
      <div className="px-5 pt-10 pb-4">
        <div className="h-3 w-20 shimmer rounded-lg mb-2" />
        <div className="h-8 w-32 shimmer rounded-lg" />
      </div>
      <div className="px-4 space-y-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-4 space-y-2">
              <div className="h-3 w-16 shimmer rounded" />
              <div className="h-8 w-20 shimmer rounded" />
              <div className="h-3 w-12 shimmer rounded" />
            </div>
          ))}
        </div>
        {/* Heatmap skeleton */}
        <div className="card p-5">
          <div className="h-3 w-28 shimmer rounded mb-4" />
          <div className="h-24 shimmer rounded-xl" />
        </div>
        {/* Chart skeleton */}
        <div className="card p-5">
          <div className="h-3 w-36 shimmer rounded mb-4" />
          <div className="h-40 shimmer rounded-xl" />
        </div>
      </div>
    </div>
  )
}
