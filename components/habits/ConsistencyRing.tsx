interface Props {
  done: number
  total: number
  size?: number
  strokeWidth?: number
}

export default function ConsistencyRing({
  done,
  total,
  size = 48,
  strokeWidth = 4,
}: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total === 0 ? 0 : done / total
  const offset = circumference * (1 - progress)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)' }}
      aria-label={`${done} of ${total} habits completed`}
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-ink-700"
      />
      {/* Fill */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-teal-400 transition-all duration-700 ease-out"
      />
    </svg>
  )
}
