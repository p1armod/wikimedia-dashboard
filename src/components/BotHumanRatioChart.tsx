import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { useAppSelector } from '../store/hooks';



const BOT_COLOR = '#bd4f6c';    // rose-wine
const HUMAN_COLOR = '#ddedaa';  // tea-green

// Main component renderer
export default function BotHumanRatioChart() {
  const botRatioHistory = useAppSelector((state) => state.analytics.botRatioHistory);
  const botRatio = useAppSelector((state) => state.analytics.botRatio);
  const isDark = useAppSelector((state) => state.theme.mode === 'dark');

  const chartData = useMemo(() => {
    return botRatioHistory.map((stat: any) => ({
      time: stat.windowStart ? format(new Date(stat.windowStart), 'HH:mm') : '',
      botEdits: stat.botEdits,
      humanEdits: stat.humanEdits,
    }));
  }, [botRatioHistory]);

  const botPct = botRatio ? botRatio.botPercentage.toFixed(1) : '0.0';
  const totalEdits = botRatio ? botRatio.botEdits + botRatio.humanEdits : 0;

  const tooltipBg = isDark ? '#202122' : '#ffffff';
  const tooltipBorder = isDark ? '#27292d' : '#eaecf0';
  const tooltipText = isDark ? '#eaecf0' : '#27292d';

  return (
    <div className="card" id="bot-human-ratio-chart">
      <div className="card-header">
        <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Bot vs Human Activity
        <span className="ml-auto text-xs text-surface-400 dark:text-surface-500 normal-case tracking-normal">
          {botRatioHistory.length > 0 ? `${botRatioHistory.length} × 5 min candles` : ''}
        </span>
      </div>

      {botRatioHistory.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-surface-400 dark:text-surface-500">
          <p>Waiting for data...</p>
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#202122' : '#eaecf0'} vertical={false} />
              <XAxis dataKey="time" stroke={isDark ? '#54595d' : '#72777d'} tick={{ fontSize: 11 }} />
              <YAxis stroke={isDark ? '#54595d' : '#72777d'} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: tooltipText,
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="botEdits" name="Bot Edits" stackId="a" fill={BOT_COLOR} isAnimationActive={false} />
              <Bar dataKey="humanEdits" name="Human Edits" stackId="a" fill={HUMAN_COLOR} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>

          <div className="text-center text-xs text-surface-400 dark:text-surface-500 mt-2 flex justify-between px-4">
            <span>Current Bot Ratio: {botPct}%</span>
            <span>Current Total Edits: {totalEdits.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
