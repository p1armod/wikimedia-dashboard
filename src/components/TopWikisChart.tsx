import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { useAppSelector } from '../store/hooks';

const COLORS = [
  '#93b5c6', // powder-blue
  '#ddedaa', // tea-green
  '#f0cf65', // royal-gold
  '#d7816a', // burnt-peach
  '#bd4f6c', // rose-wine
];

// Main component renderer
export default function TopWikisChart() {
  const topWikis = useAppSelector((state) => state.analytics.topWikis);
  const isDark = useAppSelector((state) => state.theme.mode === 'dark');

  const chartData = useMemo(() => {
    return [...topWikis]
      .sort((a, b) => a.edits - b.edits) // Sort ascending for horizontal bar
      .map((wiki) => ({
        name: wiki.wiki.replace('.org', ''),
        edits: wiki.edits,
        percentage: wiki.percentage.toFixed(1),
      }));
  }, [topWikis]);

  const gridColor = isDark ? '#202122' : '#eaecf0';
  const axisColor = isDark ? '#54595d' : '#72777d';
  const tooltipBg = isDark ? '#202122' : '#ffffff';
  const tooltipBorder = isDark ? '#27292d' : '#eaecf0';
  const tooltipText = isDark ? '#eaecf0' : '#27292d';

  return (
    <div className="card" id="top-wikis-chart">
      <div className="card-header">
        <svg className="w-4 h-4 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Top Wikis
        <span className="ml-auto text-xs text-surface-400 dark:text-surface-500 normal-case tracking-normal">
          Last 1 min
        </span>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-surface-400 dark:text-surface-500">
          <p>Waiting for data...</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" stroke={axisColor} tick={{ fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              stroke={axisColor}
              tick={{ fontSize: 11 }}
              width={130}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
                color: tooltipText,
                fontSize: '12px',
              }}
              formatter={(value: any, _name: any, props: any) => [
                `${Number(value).toLocaleString()} edits (${props.payload.percentage}%)`,
                'Edits'
              ]}
            />
            <Bar dataKey="edits" radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
