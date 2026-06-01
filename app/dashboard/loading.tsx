export default function DashboardLoading() {
  return (
    <div className="min-h-screen max-w-lg mx-auto" style={{ background: 'var(--bg-primary)' }}>
      {/* Nav skeleton */}
      <div className="px-5 pt-10 pb-4">
        <div className="h-3 w-24 rounded-lg shimmer mb-2" />
        <div className="h-8 w-48 rounded-lg shimmer" />
      </div>

      <div className="px-4 space-y-4">
        {/* Progress card skeleton */}
        <div className="card p-5 flex items-center gap-4" style={{ minHeight: 80 }}>
          <div className="w-14 h-14 rounded-full shimmer flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded-lg shimmer" />
            <div className="h-3 w-24 rounded-lg shimmer" />
          </div>
        </div>

        {/* Habit skeletons */}
        {[1,2,3,4].map(i => (
          <div key={i} className="card p-4 flex items-center gap-4" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="w-11 h-11 rounded-2xl shimmer flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded-lg shimmer" style={{ width: `${50 + i * 10}%` }} />
              <div className="h-3 w-16 rounded-lg shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
