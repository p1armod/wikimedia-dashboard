import { useAppSelector } from '../store/hooks';
import { format } from 'date-fns';

const WIKI_FLAGS: Record<string, string> = {
  'en': '🇺🇸', 'de': '🇩🇪', 'fr': '🇫🇷', 'ja': '🇯🇵',
  'es': '🇪🇸', 'ru': '🇷🇺', 'pt': '🇧🇷', 'zh': '🇨🇳',
  'it': '🇮🇹', 'ar': '🇪🇬', 'pl': '🇵🇱', 'nl': '🇳🇱',
  'fa': '🇮🇷', 'uk': '🇺🇦', 'sv': '🇸🇪', 'ko': '🇰🇷',
  'tr': '🇹🇷', 'vi': '🇻🇳', 'id': '🇮🇩', 'he': '🇮🇱',
  'cs': '🇨🇿', 'fi': '🇫🇮', 'hu': '🇭🇺', 'ca': '🏴',
  'no': '🇳🇴', 'ro': '🇷🇴', 'da': '🇩🇰', 'sr': '🇷🇸',
  'bg': '🇧🇬', 'ms': '🇲🇾',
};

function getFlag(serverName: string): string {
  if (!serverName) return '🌐';
  const lang = serverName.split('.')[0];
  return WIKI_FLAGS[lang] || '🌐';
}

function getEditDelta(event: any): { text: string; className: string } {
  const newLen = event.length?.new ?? event.lengthNew ?? 0;
  const oldLen = event.length?.old ?? event.lengthOld ?? 0;
  const delta = newLen - oldLen;

  if (delta > 0) {
    return { text: `+${delta.toLocaleString()} B`, className: 'text-emerald-600 dark:text-emerald-400' };
  } else if (delta < 0) {
    return { text: `${delta.toLocaleString()} B`, className: 'text-red-600 dark:text-red-400' };
  }
  return { text: '0 B', className: 'text-surface-400 dark:text-surface-500' };
}

// Main component renderer
export default function LiveFeed() {
  const feedEvents = useAppSelector((state) => state.analytics.feedEvents);

  return (
    <div className="card" id="live-feed">
      <div className="card-header">
        <svg className="w-4 h-4 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Live Feed
        <span className="ml-2 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400 animate-pulse" />
        <span className="ml-auto text-xs text-surface-400 dark:text-surface-500 normal-case tracking-normal">
          {feedEvents.length} events
        </span>
      </div>

      <div className="space-y-1 overflow-y-auto font-mono text-xs" style={{ maxHeight: '250px', overflowAnchor: 'none' }}>
        {feedEvents.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-surface-400 dark:text-surface-500 font-sans text-sm">
            <p>Waiting for events...</p>
          </div>
        ) : (
          feedEvents.map((event, index) => {
            const delta = getEditDelta(event);
            const serverName = event.server_name || '';
            const flag = getFlag(serverName);
            const timestamp = event.timestamp
              ? format(new Date(event.timestamp * 1000), 'HH:mm:ss')
              : '--:--:--';

            return (
              <div
                key={`${event.id || index}-${event.timestamp}`}
                className="animate-slide-in flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-50 dark:hover:bg-surface-700/40 transition-colors"
              >
                <span className="text-base flex-shrink-0">{flag}</span>
                <span className="text-surface-500 dark:text-surface-400 flex-shrink-0 w-14">{timestamp}</span>
                <span className="text-surface-800 dark:text-surface-200 truncate flex-1" title={event.title}>
                  {event.title || 'Untitled'}
                </span>
                <span className="text-surface-500 truncate max-w-[100px]" title={event.user}>
                  {event.user || 'anonymous'}
                  {event.bot && <span className="ml-1 text-yellow-500">🤖</span>}
                </span>
                <span className={`flex-shrink-0 w-20 text-right ${delta.className}`}>
                  {delta.text}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
