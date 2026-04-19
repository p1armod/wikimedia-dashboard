import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EditStats, WikiStat, BotRatioStat, AlertEvent, WikimediaFeedEvent } from '../types';

const MAX_EDIT_STATS = 60;     // 60 minutes of 1-minute windows
const MAX_ALERTS = 50;
const MAX_FEED_EVENTS = 20;

interface AnalyticsState {
  editStats: EditStats[];
  currentEditsPerMinute: number;
  topWikis: WikiStat[];
  botRatio: BotRatioStat | null;
  botRatioHistory: BotRatioStat[];
  alerts: AlertEvent[];
  unreadAlertCount: number;
  feedEvents: WikimediaFeedEvent[];
}

const initialState: AnalyticsState = {
  editStats: [],
  currentEditsPerMinute: 0,
  topWikis: [],
  botRatio: null,
  botRatioHistory: [],
  alerts: [],
  unreadAlertCount: 0,
  feedEvents: [],
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {

    addEditStat(state, action: PayloadAction<EditStats>) {
      state.editStats.push(action.payload);

      if (state.editStats.length > MAX_EDIT_STATS) {
        state.editStats = state.editStats.slice(state.editStats.length - MAX_EDIT_STATS);
      }
      state.currentEditsPerMinute = action.payload.editsPerMinute;
    },

    setEditStatsHistory(state, action: PayloadAction<EditStats[]>) {
      state.editStats = action.payload;
      if (action.payload.length > 0) {
        state.currentEditsPerMinute = action.payload[action.payload.length - 1].editsPerMinute;
      }
    },

    setTopWikis(state, action: PayloadAction<WikiStat[]>) {
      state.topWikis = action.payload;
    },

    setBotRatio(state, action: PayloadAction<BotRatioStat>) {
      state.botRatio = action.payload;
      state.botRatioHistory.push(action.payload);
      if (state.botRatioHistory.length > 20) {
        state.botRatioHistory = state.botRatioHistory.slice(state.botRatioHistory.length - 20);
      }
    },

    setBotRatioHistory(state, action: PayloadAction<BotRatioStat[]>) {
      state.botRatioHistory = action.payload;
      if (action.payload.length > 0) {
        state.botRatio = action.payload[action.payload.length - 1];
      }
    },

    addAlert(state, action: PayloadAction<AlertEvent>) {
      state.alerts.unshift(action.payload);
      if (state.alerts.length > MAX_ALERTS) {
        state.alerts = state.alerts.slice(0, MAX_ALERTS);
      }
      state.unreadAlertCount += 1;
    },

    clearAlerts(state) {
      state.alerts = [];
      state.unreadAlertCount = 0;
    },

    markAlertsRead(state) {
      state.unreadAlertCount = 0;
    },

    addFeedEvent(state, action: PayloadAction<WikimediaFeedEvent>) {
      state.feedEvents.unshift(action.payload);
      if (state.feedEvents.length > MAX_FEED_EVENTS) {
        state.feedEvents = state.feedEvents.slice(0, MAX_FEED_EVENTS);
      }
    },
  },
});

// Define Redux state slice
export const {
  addEditStat,
  setEditStatsHistory,
  setTopWikis,
  setBotRatio,
  setBotRatioHistory,
  addAlert,
  clearAlerts,
  markAlertsRead,
  addFeedEvent,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
