// Server component — pure SVG donut chart, zero dependencies
export interface DonutSlice {
  label: string
  value: number   // any unit — used for proportions
  color: string
}

interface Props {
  slices: DonutSlice[]
  centerLabel?: string   // e.g. "Revenue"
  formatValue?: (v: number) => string
}

export default function CourseDonutChart({ slices, centerLabel = 'Total', formatValue }: Props) {
  const W = 220, H = 220
  const cx = W / 2, cy = H / 2
  const R = 82, r = 50   // outer / inner radius

  const total = slices.reduce((s, d) => s + d.value, 0)
  if (total === 0) {
    return (
      <div className="flex items-center justify-center text-gray-400 text-sm" style={{ width: W, height: H }}>
        No data
      </div>
    )
  }

  const fmt = formatValue ?? ((v: number) => v.toString())

  // Build arc paths
  let angle = -Math.PI / 2   // start at top
  const arcs = slices.map((s) => {
    const sweep = (s.value / total) * 2 * Math.PI
    const startA = angle
    const endA = angle + sweep
    angle = endA

    const x1 = cx + R * Math.cos(startA), y1 = cy + R * Math.sin(startA)
    const x2 = cx + R * Math.cos(endA),   y2 = cy + R * Math.sin(endA)
    const ix1 = cx + r * Math.cos(startA), iy1 = cy + r * Math.sin(startA)
    const ix2 = cx + r * Math.cos(endA),   iy2 = cy + r * Math.sin(endA)
    const large = sweep > Math.PI ? 1 : 0

    const d = [
      `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
      `A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      `L ${ix2.toFixed(2)} ${iy2.toFixed(2)}`,
      `A ${r} ${r} 0 ${large} 0 ${ix1.toFixed(2)} ${iy1.toFixed(2)}`,
      'Z',
    ].join(' ')

    return { ...s, d, pct: Math.round((s.value / total) * 100) }
  })

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }} aria-label="Donut chart">
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill={arc.color} stroke="white" strokeWidth="2">
          <title>{arc.label}: {fmt(arc.value)} ({arc.pct}%)</title>
        </path>
      ))}
      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="inherit">
        {centerLabel}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111827" fontFamily="inherit">
        {fmt(total)}
      </text>
    </svg>
  )
}
