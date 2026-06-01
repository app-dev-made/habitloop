export default function InsightsLoading() {
  return (
    <div className="min-h-screen max-w-lg mx-auto pb-28" style={{ background: 'var(--bg-primary)' }}>
      <div className="pwa-header px-5 pt-6 pb-4">
        <div className="h-8 w-28 rounded-lg shimmer mb-2" />
        <div className="h-4 w-20 rounded-lg shimmer" />
      </div>
      <div className="px-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-4" style={{ minHeight: 88 }}>
              <div className="h-3 w-20 rounded shimmer mb-3" />
              <div className="h-10 w-16 rounded shimmer" />
            </div>
          ))}
        </div>
        <div className="card p-5" style={{ height: 200 }}>
          <div className="h-3 w-28 rounded shimmer mb-4" />
          <div className="h-full shimmer rounded-xl" />
        </div>
        <div className="card p-5" style={{ height: 160 }}>
          <div className="h-3 w-24 rounded shimmer mb-4" />
          <div className="h-full shimmer rounded-xl" />
        </div>
      </div>
    </div>
  )
}
