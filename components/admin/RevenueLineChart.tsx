// Server component — pure SVG, zero dependencies
interface Props {
  labels: string[]
  revenues: number[]   // dollars
  counts:   number[]
}

function smoothPath(pts: [number, number][]): string {
  if (pts.length === 0) return ''
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1]
    const [cx, cy] = pts[i]
    const cpx = (px + cx) / 2
    d += ` C ${cpx.toFixed(1)} ${py.toFixed(1)},${cpx.toFixed(1)} ${cy.toFixed(1)},${cx.toFixed(1)} ${cy.toFixed(1)}`
  }
  return d
}

export default function RevenueLineChart({ labels, revenues, counts }: Props) {
  const W = 560, H = 200
  const padL = 58, padR = 16, padT = 16, padB = 36
  const cW = W - padL - padR
  const cH = H - padT - padB

  const n = revenues.length
  const maxVal = Math.max(...revenues, 1)

  const xPos = (i: number) => padL + (n < 2 ? cW / 2 : (i / (n - 1)) * cW)
  const yPos = (v: number) => padT + cH - Math.max(0, Math.min(1, v / maxVal)) * cH

  const pts: [number, number][] = revenues.map((v, i) => [xPos(i), yPos(v)])
  const linePath = smoothPath(pts)

  const areaPath = n === 0 ? '' : [
    `M ${xPos(0).toFixed(1)} ${(padT + cH).toFixed(1)}`,
    linePath.slice(1),  // reuse line minus the M
    `L ${xPos(n - 1).toFixed(1)} ${(padT + cH).toFixed(1)} Z`,
  ].join(' ')

  const yTickCount = 4
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => ({
    val: (maxVal * (yTickCount - i)) / yTickCount,
    y:   padT + (i / yTickCount) * cH,
  }))

  function fmt(v: number) {
    if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`
    return `$${v.toFixed(0)}`
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: H }}
      aria-label="Monthly revenue line chart"
    >
      <defs>
        <linearGradient id="rl-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FF6F00" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#FF6F00" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Grid lines + Y labels */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={padL} y1={t.y.toFixed(1)}
            x2={W - padR} y2={t.y.toFixed(1)}
            stroke="#f3f4f6" strokeWidth="1"
          />
          <text
            x={padL - 8} y={(t.y + 4).toFixed(1)}
            textAnchor="end" fontSize="10" fill="#9ca3af" fontFamily="inherit"
          >{fmt(t.val)}</text>
        </g>
      ))}

      {/* Area fill */}
      {n > 0 && <path d={areaPath} fill="url(#rl-area)" />}

      {/* Line */}
      {n > 0 && (
        <path d={linePath} fill="none" stroke="#FF6F00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* Data points */}
      {pts.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx.toFixed(1)} cy={cy.toFixed(1)} r="5" fill="white" stroke="#FF6F00" strokeWidth="2.5" />
          {/* Tooltip text on hover via title */}
          <title>{labels[i]}: {fmt(revenues[i])} · {counts[i]} sale{counts[i] !== 1 ? 's' : ''}</title>
        </g>
      ))}

      {/* X-axis labels */}
      {labels.map((label, i) => (
        <text
          key={i}
          x={xPos(i).toFixed(1)} y={H - 6}
          textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="inherit"
        >{label}</text>
      ))}

      {/* X-axis baseline */}
      <line x1={padL} y1={padT + cH} x2={W - padR} y2={padT + cH} stroke="#e5e7eb" strokeWidth="1" />
    </svg>
  )
}
