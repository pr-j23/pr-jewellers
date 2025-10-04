import { useEffect, useState } from 'react';

/**
 * Custom hook for managing WebSocket connections
 * @param {string} url - WebSocket URL to connect to
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoReconnect - Whether to auto reconnect (default: true)
 * @param {number} options.reconnectInterval - Milliseconds between reconnect attempts
 * @returns {Object} WebSocket state and data
 */
export const useWebSocket = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Variables for WebSocket connection management
    let ws;
    let reconnectTimeout;
    let isReconnecting = false; // Prevent multiple reconnection attempts
    const reconnectInterval = options.reconnectInterval || 30000; // 30 seconds for reconnection

    const connect = () => {
      // Create a WebSocket connection
      ws = new WebSocket(url);

      // Handle the connection opening
      ws.onopen = () => {
        console.log('WebSocket connection established.');
        setIsConnected(true);
        isReconnecting = false; // Reset reconnection flag
      };

      // Handle incoming messages from the server
      ws.onmessage = event => {
        try {
          const parsedData = JSON.parse(event?.data);
          setData(parsedData);
        } catch (err) {
          setError(new Error('Error parsing WebSocket message'));
          console.error('Error parsing WebSocket message:', err);
        }
      };

      // Handle errors
      ws.onerror = error => {
        setError(error);
        console.error('WebSocket error:', error);
      };

      // Handle the connection closing
      ws.onclose = () => {
        console.log('WebSocket connection closed.');
        setIsConnected(false);

        if (!isReconnecting && options.autoReconnect !== false) {
          isReconnecting = true;
          console.log(`Reconnecting in ${reconnectInterval / 1000} seconds...`);
          reconnectTimeout = setTimeout(() => {
            connect(); // Try to reconnect
          }, reconnectInterval);
        }
      };
    };

    connect();

    // Cleanup function to close WebSocket connection when component unmounts
    return () => {
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
    isConnected: isConnected,
    error,
  };
};

export default useWebSocket;
