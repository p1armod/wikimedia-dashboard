import { useWebSocket } from './hooks/useWebSocket';
import EditsPerMinuteChart from './components/EditsPerMinuteChart';
import TopWikisChart from './components/TopWikisChart';
import BotHumanRatioChart from './components/BotHumanRatioChart';
import GeoHeatmap from './components/GeoHeatmap';
import AlertsPanel from './components/AlertsPanel';
import LiveFeed from './components/LiveFeed';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { toggleTheme } from './store/themeSlice';
import { setEditStatsHistory, setBotRatioHistory } from './store/analyticsSlice';
import { fetchHistoricalStats, fetchHistoricalBotRatio } from './api/historyApi';
import { useEffect } from 'react';


// Main component renderer
export default function App() {
  const connectionStatus = useWebSocket();
  const currentEPM = useAppSelector((state) => state.analytics.currentEditsPerMinute);
  const unreadAlerts = useAppSelector((state) => state.analytics.unreadAlertCount);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  // Initialize state on component mount
  useEffect(() => {
    const loadHistory = async () => {
      const [statsHistory, botRatioHistory] = await Promise.all([
        fetchHistoricalStats(),
        fetchHistoricalBotRatio()
      ]);
      dispatch(setEditStatsHistory(statsHistory));
      dispatch(setBotRatioHistory(botRatioHistory));
    };
    
    loadHistory();
  }, [dispatch]);

  const statusLabel = {
    connected: 'Connected',
    connecting: 'Connecting...',
    disconnected: 'Disconnected',
  }[connectionStatus];

  return (
    <div className="min-h-screen bg-white dark:bg-surface-900 transition-colors duration-300">
      {}
      <header className="sticky top-0 z-[9999] bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#b8860b] dark:text-[#f0cf65]">
              Wikimedia Live Analytics
            </h1>
            <span className="hidden sm:inline-block text-xs text-surface-500 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          <div className="flex items-center gap-4">
            {}
            {currentEPM > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-surface-500 dark:text-surface-400">EPM:</span>
                <span className="font-mono font-bold text-[#b8860b] dark:text-[#f0cf65]">
                  {currentEPM.toLocaleString()}
                </span>
              </div>
            )}

            {}
            {unreadAlerts > 0 && (
              <div className="relative">
                <svg className="w-5 h-5 text-surface-500 dark:text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                  {unreadAlerts > 9 ? '9+' : unreadAlerts}
                </span>
              </div>
            )}

            {}
            <button
              id="theme-toggle"
              onClick={() => dispatch(toggleTheme())}
              className="p-1.5 rounded-lg text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {themeMode === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {}
            <div className="flex items-center gap-2">
              <div className={`connection-dot ${connectionStatus}`} />
              <span className="text-xs text-surface-500 dark:text-surface-400">{statusLabel}</span>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">

        {}
        <LiveFeed />

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EditsPerMinuteChart />
          <TopWikisChart />
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BotHumanRatioChart />
          <AlertsPanel />
        </div>

        {}
        <GeoHeatmap />
      </main>

      {}
      <footer className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-surface-400 dark:text-surface-600 border-t border-surface-200 dark:border-surface-800">
        Powered by Wikimedia EventStreams • Apache Kafka • Spring Boot • React
      </footer>
    </div>
  );
}
