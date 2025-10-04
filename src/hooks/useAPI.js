import { useState, useCallback } from 'react';
import { getAPI, postAPI, putAPI, deleteAPI } from '../utils/axios';
import toast from 'react-hot-toast';

/**
 * Custom hook for API calls with loading and error states
 * @param {any} initialState - Initial data state
 * @param {Object} options - Configuration options
 * @param {boolean} options.showToast - Whether to show toast notifications
 * @returns {Object} API state and request methods
 */
export const useAPI = (initialState = null, options = {}) => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast = true } = options;

  const request = useCallback(
    async (method, url, payload = null, reqOptions = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        let response;

        switch (method.toLowerCase()) {
          case 'get':
            response = await getAPI(url, reqOptions);
            break;
          case 'post':
            response = await postAPI(url, payload, reqOptions);
            break;
          case 'put':
            response = await putAPI(url, payload, reqOptions);
            break;
          case 'delete':
            response = await deleteAPI(url, payload, reqOptions);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        // Check if response has an error status
        if (response?.status === 'error') {
          throw new Error(response.message || 'An error occurred');
        }

        setData(response);
        return response;
      } catch (err) {
        setError(err);

        // Show error toast if enabled
        if (showToast) {
          toast.error(err.message || 'An error occurred');
        }

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const get = useCallback((url, reqOptions) => request('get', url, null, reqOptions), [request]);

  const post = useCallback(
    (url, data, reqOptions) => request('post', url, data, reqOptions),
    [request]
  );

  const put = useCallback(
    (url, data, reqOptions) => request('put', url, data, reqOptions),
    [request]
  );

  const del = useCallback(
    (url, data, reqOptions) => request('delete', url, data, reqOptions),
    [request]
  );

  return {
    data,
    isLoading,
    error,
    get,
    post,
    put,
    delete: del,
    request,
    reset: () => {
      setData(initialState);
      setError(null);
    },
  };
};

export default useAPI;
