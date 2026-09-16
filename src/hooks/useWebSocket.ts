import { useEffect, useState } from 'react';

export type UseWebSocketOptions = {
  autoReconnect?: boolean;
  reconnectInterval?: number;
};

export type UseWebSocketState<TData> = {
  data: TData | null;
  isConnected: boolean;
  error: Event | Error | null;
};

export const useWebSocket = <TData = unknown>(
  url: string,
  options: UseWebSocketOptions = {}
): UseWebSocketState<TData> => {
  const [data, setData] = useState<TData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | Error | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let isReconnecting = false;
    let isActive = true;
    const reconnectInterval = options.reconnectInterval ?? 30000;
    const shouldAutoReconnect = options.autoReconnect ?? true;

    const connect = () => {
      if (!isActive) return;

      ws = new WebSocket(url);

      ws.onopen = () => {
        if (!isActive) return;
        setIsConnected(true);
        isReconnecting = false;
      };

      ws.onmessage = event => {
        if (!isActive) return;
        try {
          const parsedData = JSON.parse(event.data) as TData;
          setData(parsedData);
        } catch (err) {
          const parseError =
            err instanceof Error ? err : new Error('Error parsing WebSocket message');
          setError(parseError);
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = event => {
        if (!isActive) return;
        setError(event);
        console.error('WebSocket error:', event);
      };

      ws.onclose = () => {
        if (!isActive) return;
        setIsConnected(false);

        if (!isReconnecting && shouldAutoReconnect) {
          isReconnecting = true;
          reconnectTimeout = setTimeout(() => {
            isReconnecting = false;
            connect();
          }, reconnectInterval);
        }
      };
    };

    connect();

    return () => {
      isActive = false;
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [url, options.autoReconnect, options.reconnectInterval]);

  return {
    data,
    isConnected,
    error,
  };
};

export default useWebSocket;
