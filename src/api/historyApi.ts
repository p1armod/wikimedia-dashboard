import axios from 'axios';
import type { EditStats, WikiStat, BotRatioStat } from '../types';



const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
});


export async function fetchHistoricalStats(): Promise<EditStats[]> {
  try {
    const response = await api.get('/history/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch historical stats:', error);
    return [];
  }
}


export async function fetchHistoricalBotRatio(): Promise<BotRatioStat[]> {
  try {
    const response = await api.get('/history/bot-ratio');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch historical bot ratio:', error);
    return [];
  }
}


export async function fetchTopWikis(): Promise<WikiStat[]> {
  try {
    const response = await api.get('/history/top-wikis');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch top wikis:', error);
    return [];
  }
}


export async function fetchCachedStats(): Promise<EditStats | null> {
  try {
    const response = await api.get('/cache/stats');
    return response.data || null;
  } catch (error) {
    console.error('Failed to fetch cached stats:', error);
    return null;
  }
}


export async function fetchCachedBotRatio(): Promise<BotRatioStat | null> {
  try {
    const response = await api.get('/cache/bot-ratio');
    return response.data || null;
  } catch (error) {
    console.error('Failed to fetch cached bot ratio:', error);
    return null;
  }
}
