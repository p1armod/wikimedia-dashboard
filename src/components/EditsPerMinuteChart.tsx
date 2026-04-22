import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { format } from 'date-fns';
import { useAppSelector } from '../store/hooks';


// Main component renderer
export default function EditsPerMinuteChart() {
  const editStats = useAppSelector((state) => state.analytics.editStats);
  const currentEPM = useAppSelector((state) => state.analytics.currentEditsPerMinute);
  const isDark = useAppSelector((state) => state.theme.mode === 'dark');

  const chartData = useMemo(() => {
    return editStats.map((stat) => ({
      time: format(new Date(stat.windowStart), 'HH:mm'),
      editsPerMinute: stat.editsPerMinute,
      uniqueUsers: stat.uniqueUsers,
      avgEditSize: Math.round(stat.avgEditSize),
    }));
  }, [editStats]);

  const rollingAverage = useMemo(() => {
    if (editStats.length === 0) return 0;
    const sum = editStats.reduce((acc, s) => acc + s.editsPerMinute, 0);
    return Math.round(sum / editStats.length);
  }, [editStats]);

  const gridColor = isDark ? '#202122' : '#eaecf0';
  const axisColor = isDark ? '#54595d' : '#72777d';
  const tooltipBg = isDark ? '#202122' : '#ffffff';
  const tooltipBorder = isDark ? '#27292d' : '#eaecf0';
  const tooltipText = isDark ? '#eaecf0' : '#27292d';
  const tooltipLabel = isDark ? '#72777d' : '#54595d';
  const chartLineColor = isDark ? '#f0cf65' : '#b8860b';

  return (
    <div className="card" id="edits-per-minute-chart">
      <div className="card-header">
        <svg className="w-4 h-4 text-[#b8860b] dark:text-[#f0cf65]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Edits Per Minute
        {currentEPM > 0 && (
          <span className="ml-auto text-lg font-bold text-[#b8860b] dark:text-[#f0cf65] normal-case tracking-normal">
            {currentEPM.toLocaleString()}
          </span>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-surface-400 dark:text-surface-500">
          <p>Waiting for data...</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="time"
              stroke={axisColor}
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke={axisColor}
              tick={{ fontSize: 11 }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
                color: tooltipText,
                fontSize: '12px',
              }}
              labelStyle={{ color: tooltipLabel }}
            />
            <ReferenceLine
              y={rollingAverage}
              stroke={chartLineColor}
              strokeDasharray="5 5"
              label={{
                value: `Avg: ${rollingAverage}`,
                position: 'right',
                fill: chartLineColor,
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="editsPerMinute"
              stroke={chartLineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: chartLineColor }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
