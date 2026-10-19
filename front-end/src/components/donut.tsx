import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

const noAnimation = { isAnimationActive: false } as const

/** A donut of up to four parts, from 12 o'clock clockwise; `active` dims the others. */
export function Donut({
  parts,
  active,
  onActive,
  children,
  className,
  inner = '72%',
}: {
  inner?: string
  parts: { id: string, amount: number, colour: string }[]
  active: number | null
  onActive: (index: number | null) => void
  children: React.ReactNode
  className: string
}) {
  const total = parts.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div aria-hidden className={`relative shrink-0 ${className}`}>
      <ResponsiveContainer height="100%" width="100%">
        <PieChart accessibilityLayer={false}>
          <Pie
            {...noAnimation}
            cornerRadius={6}
            data={
              total
                ? parts.map(p => ({ name: p.id, value: p.amount }))
                : [{ name: 'none', value: 1 }]
            }
            dataKey="value"
            endAngle={-270}
            innerRadius={inner}
            outerRadius="100%"
            paddingAngle={total ? 2 : 0}
            startAngle={90}
            stroke="none"
            onMouseEnter={(_, index) => total && onActive(index)}
            onMouseLeave={() => onActive(null)}
          >
            {total
              ? (
                  parts.map((p, i) => (
                    <Cell
                      key={p.id}
                      fill={p.colour}
                      fillOpacity={active === null || active === i ? 1 : 0.3}
                    />
                  ))
                )
              : (
                  <Cell fill="var(--chart-track)" />
                )}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        {children}
      </div>
    </div>
  )
}
