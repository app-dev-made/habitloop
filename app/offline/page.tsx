export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-ink-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-ink-800 flex items-center justify-center text-4xl mb-6">
        📡
      </div>
      <h1 className="font-display text-3xl text-ink-50 mb-3">You're offline</h1>
      <p className="text-ink-400 text-sm max-w-xs leading-relaxed mb-8">
        No internet connection. Your previously logged habits are saved. Come back online to sync.
      </p>
      <button onClick={() => window.location.reload()} className="btn-primary">
        Try again
      </button>
    </div>
  )
}
