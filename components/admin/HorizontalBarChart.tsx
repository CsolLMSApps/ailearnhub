// Server component — pure SVG horizontal bar chart, zero dependencies
export interface HBarItem {
  label: string
  value: number
  max: number
  subLabel?: string
  color?: string
}

interface Props {
  items: HBarItem[]
  height?: number        // total SVG height (auto if omitted)
  formatValue?: (v: number) => string
}

const DEFAULT_COLOR = '#FF6F00'
const COLORS = ['#FF6F00', '#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899']

export default function HorizontalBarChart({ items, formatValue }: Props) {
  const fmt = formatValue ?? ((v: number) => v.toString())
  const rowH = 44
  const padL = 148, padR = 60, padT = 8, padB = 8
  const barW = 360
  const W = padL + barW + padR
  const H = padT + items.length * rowH + padB

  // Vertical grid lines (4 ticks)
  const ticks = [0.25, 0.5, 0.75, 1].map(t => Math.round(t * barW))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} aria-label="Horizontal bar chart">
      {/* Grid lines */}
      {ticks.map((tx, i) => (
        <line
          key={i}
          x1={padL + tx} y1={padT}
          x2={padL + tx} y2={H - padB}
          stroke="#f3f4f6" strokeWidth="1"
        />
      ))}

      {items.map((item, i) => {
        const barLen = item.max > 0 ? Math.round((item.value / item.max) * barW) : 0
        const barY = padT + i * rowH + 10
        const color = item.color ?? COLORS[i % COLORS.length]

        return (
          <g key={i}>
            {/* Label */}
            <text
              x={padL - 10} y={barY + 11}
              textAnchor="end" fontSize="11" fontWeight="600" fill="#374151" fontFamily="inherit"
            >
              {item.label.length > 20 ? item.label.slice(0, 19) + '…' : item.label}
            </text>
            {item.subLabel && (
              <text
                x={padL - 10} y={barY + 24}
                textAnchor="end" fontSize="9" fill="#9ca3af" fontFamily="inherit"
              >{item.subLabel}</text>
            )}

            {/* Background track */}
            <rect x={padL} y={barY} width={barW} height={16} rx="8" fill="#f3f4f6" />

            {/* Value bar */}
            <rect x={padL} y={barY} width={Math.max(barLen, 0)} height={16} rx="8" fill={color}>
              <title>{item.label}: {fmt(item.value)}</title>
            </rect>

            {/* Value label */}
            <text
              x={padL + barW + 8} y={barY + 12}
              fontSize="11" fontWeight="bold" fill="#374151" fontFamily="inherit"
            >{fmt(item.value)}</text>
          </g>
        )
      })}
    </svg>
  )
}
