import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearAlerts, markAlertsRead } from '../store/analyticsSlice';
import { formatDistanceToNow } from 'date-fns';


// Main component renderer
export default function AlertsPanel() {
  const alerts = useAppSelector((state) => state.analytics.alerts);
  const unreadCount = useAppSelector((state) => state.analytics.unreadAlertCount);
  const dispatch = useAppDispatch();

  return (
    <div className="card" id="alerts-panel">
      <div className="card-header">
        <svg className="w-4 h-4 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        Alerts
        {unreadCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
        <div className="ml-auto flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => dispatch(markAlertsRead())}
              className="text-xs text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors normal-case tracking-normal"
            >
              Mark read
            </button>
          )}
          {alerts.length > 0 && (
            <button
              onClick={() => dispatch(clearAlerts())}
              className="text-xs text-surface-500 dark:text-surface-400 hover:text-red-500 dark:hover:text-red-400 transition-colors normal-case tracking-normal"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '300px' }}>
        {alerts.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-surface-400 dark:text-surface-500 text-sm">
            <p>No alerts yet — monitoring for spikes...</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div
              key={alert.alertId || index}
              className="animate-slide-in bg-surface-50 dark:bg-surface-700/40 rounded-lg p-3 border border-surface-200 dark:border-surface-700/50 hover:border-surface-300 dark:hover:border-surface-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className={alert.severity === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}>
                  {alert.severity}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">
                    {alert.wiki}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    {alert.editCount.toLocaleString()} edits vs {alert.baseline.toFixed(0)} baseline
                    ({(alert.editCount / Math.max(alert.baseline, 1)).toFixed(1)}x normal)
                  </p>
                </div>
                <span className="text-xs text-surface-400 dark:text-surface-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(alert.detectedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
