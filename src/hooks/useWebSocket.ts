import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAppDispatch } from '../store/hooks';
import { addEditStat, setTopWikis, setBotRatio, addAlert, addFeedEvent } from '../store/analyticsSlice';
import type { ConnectionStatus, EditStats, WikiStat, BotRatioStat, AlertEvent, WikimediaFeedEvent } from '../types';



const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';
const RECONNECT_DELAY = 5000;

export function useWebSocket(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const clientRef = useRef<Client | null>(null);
  const dispatch = useAppDispatch();

  // Initialize state on component mount
  useEffect(() => {
    const client = new Client({

      webSocketFactory: () => new SockJS(WS_URL) as any,
      reconnectDelay: RECONNECT_DELAY,

      onConnect: () => {
        console.log('WebSocket connected');
        setStatus('connected');

        client.subscribe('/topic/stats', (message) => {
          try {
            const stats: EditStats = JSON.parse(message.body);
            dispatch(addEditStat(stats));
          } catch (e) {
            console.error('Failed to parse stats:', e);
          }
        });

        client.subscribe('/topic/top-wikis', (message) => {
          try {
            const wikis: WikiStat[] = JSON.parse(message.body);
            dispatch(setTopWikis(wikis));
          } catch (e) {
            console.error('Failed to parse top-wikis:', e);
          }
        });

        client.subscribe('/topic/bot-ratio', (message) => {
          try {
            const ratio: BotRatioStat = JSON.parse(message.body);
            dispatch(setBotRatio(ratio));
          } catch (e) {
            console.error('Failed to parse bot-ratio:', e);
          }
        });

        client.subscribe('/topic/alerts', (message) => {
          try {
            const alert: AlertEvent = JSON.parse(message.body);
            dispatch(addAlert(alert));
          } catch (e) {
            console.error('Failed to parse alert:', e);
          }
        });

        client.subscribe('/topic/feed', (message) => {
          try {
            const event: WikimediaFeedEvent = JSON.parse(message.body);
            dispatch(addFeedEvent(event));
          } catch (e) {
            console.debug('Failed to parse feed event:', e);
          }
        });
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        setStatus('disconnected');
      },

      onWebSocketClose: () => {
        console.log('WebSocket disconnected, will retry...');
        setStatus('connecting');
      },

      onDisconnect: () => {
        setStatus('disconnected');
      },
    });

    setStatus('connecting');
    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return status;
}
