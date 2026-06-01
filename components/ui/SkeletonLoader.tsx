export function HabitSkeleton() {
  return (
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="card p-4 flex items-center gap-4 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="w-10 h-10 rounded-full shimmer flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 shimmer rounded-lg w-2/3" />
            <div className="h-3 shimmer rounded-lg w-1/3" />
          </div>
          <div className="w-8 h-8 shimmer rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="card px-5 py-4 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full shimmer" />
      <div className="space-y-2">
        <div className="h-4 shimmer rounded-lg w-32" />
        <div className="h-3 shimmer rounded-lg w-20" />
      </div>
    </div>
  )
}
