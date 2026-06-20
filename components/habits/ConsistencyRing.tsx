interface Props {
  done:        number
  total:       number
  size?:       number
  strokeWidth?: number
}

export default function ConsistencyRing({ done, total, size = 48, strokeWidth = 4 }: Props) {
  const radius       = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress     = total === 0 ? 0 : done / total
  const offset       = circumference * (1 - progress)
  const pct          = Math.round(progress * 100)

  // Color shifts from muted → brand → bright based on completion
  const fillColor =
    pct >= 100 ? '#4DD9AC' :
    pct >= 70  ? '#1D9E75' :
    pct >= 40  ? '#1D9E75' :
    pct >  0   ? '#125D45' : 'transparent'

  const trackColor = 'var(--bg-elevated)'

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
      role="img"
      aria-label={`${done} of ${total} habits completed, ${pct}%`}
    >
      <title>{pct}% complete</title>

      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />

      {/* Glow filter */}
      {pct > 0 && (
        <defs>
          <filter id={`ring-glow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      )}

      {/* Fill */}
      {pct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter={pct >= 70 ? `url(#ring-glow-${size})` : undefined}
          style={{
            transition: 'stroke-dashoffset 0.75s cubic-bezier(0.16,1,0.3,1), stroke 0.4s ease',
          }}
        />
      )}
    </svg>
  )
}
