export default function HabitsLoading() {
  return (
    <div className="min-h-screen max-w-lg mx-auto pb-28" style={{ background: 'var(--bg-primary)' }}>
      <div className="pwa-header px-5 pt-6 pb-4">
        <div className="h-8 w-40 rounded-lg shimmer mb-2" />
        <div className="h-4 w-56 rounded-lg shimmer" />
      </div>
      <div className="px-4 space-y-3">
        <div className="h-3 w-20 rounded shimmer" />
        {[1,2,3].map(i => (
          <div key={i} className="card flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-xl shimmer flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 rounded shimmer" style={{ width: `${40 + i * 15}%` }} />
              <div className="h-3 w-20 rounded shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
