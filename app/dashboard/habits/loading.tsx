export default function HabitsLoading() {
  return (
    <div className="min-h-screen max-w-lg mx-auto pb-28" style={{ background: 'var(--bg-primary)' }}>
      <div className="px-5 pt-10 pb-4">
        <div className="h-3 w-20 shimmer rounded-lg mb-2" />
        <div className="h-8 w-36 shimmer rounded-lg" />
      </div>
      <div className="px-4 space-y-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="card p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl shimmer flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 shimmer rounded" style={{ width: `${55 + i * 8}%` }} />
              <div className="h-3 w-20 shimmer rounded" />
            </div>
            <div className="w-16 h-7 shimmer rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
