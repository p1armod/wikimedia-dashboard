

export interface EditStats {
  windowStart: number;
  windowEnd: number;
  totalEdits: number;
  uniqueUsers: number;
  avgEditSize: number;
  editsPerMinute: number;
}

export interface WikiStat {
  wiki: string;
  edits: number;
  percentage: number;
}

export interface BotRatioStat {
  botEdits: number;
  humanEdits: number;
  botPercentage: number;
  windowStart: number;
}

export interface AlertEvent {
  alertId: string;
  wiki: string;
  severity: 'WARNING' | 'CRITICAL';
  editCount: number;
  baseline: number;
  detectedAt: number;
  message: string;
}

export interface WikimediaFeedEvent {
  id: string;
  type: string;
  wiki: string;
  title: string;
  user: string;
  bot: boolean;
  server_name: string;
  timestamp: number;
  length?: {
    new?: number;
    old?: number;
  };
  comment: string;
  meta?: Record<string, unknown>;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';
