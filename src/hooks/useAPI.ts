import { useState, useCallback, useEffect, useRef } from 'react';
import { getAPI, postAPI, putAPI, deleteAPI } from '../utils/axios';
import toast from 'react-hot-toast';
import type { AxiosRequestConfig } from 'axios';

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

type UseApiOptions = {
  showToast?: boolean;
};

type ApiErrorResponse = {
  status: 'error';
  message?: string;
};

type ApiSuccessResponse<T> = {
  status?: 'success';
  data?: T;
  message?: string;
};

type ApiResponse<T> = ApiErrorResponse | ApiSuccessResponse<T> | T;

const isApiError = <T>(response: ApiResponse<T>): response is ApiErrorResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'status' in response &&
    response.status === 'error'
  );
};

const extractResponseData = <T>(response: ApiResponse<T>): T | null => {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return (response as ApiSuccessResponse<T>).data ?? null;
  }
  return (response as T) ?? null;
};

export const useAPI = <TData = unknown>(
  initialState: TData | null = null,
  options: UseApiOptions = {}
) => {
  const [data, setData] = useState<TData | null>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const { showToast = true } = options;

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const runIfMounted = useCallback((fn: () => void) => {
    if (isMountedRef.current) {
      fn();
    }
  }, []);

  const request = useCallback(
    async <TResult = TData>(
      method: HttpMethod,
      url: string,
      payload: unknown = null,
      reqOptions: AxiosRequestConfig = {}
    ): Promise<ApiResponse<TResult>> => {
      runIfMounted(() => {
        setIsLoading(true);
        setError(null);
      });

      try {
        let response: ApiResponse<TResult>;

        switch (method) {
          case 'get':
            response = await getAPI<TResult>(url, reqOptions);
            break;
          case 'post':
            response = await postAPI<TResult>(url, payload, reqOptions);
            break;
          case 'put':
            response = await putAPI<TResult>(url, payload, reqOptions);
            break;
          case 'delete':
            response = await deleteAPI<TResult>(url, payload, reqOptions);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        if (isApiError(response)) {
          throw new Error(response.message || 'An error occurred');
        }

        const nextData = extractResponseData(response as ApiResponse<TData>);
        if (nextData !== null) {
          runIfMounted(() => setData(nextData));
        }
        return response;
      } catch (err) {
        const normalizedError = err instanceof Error ? err : new Error('An error occurred');
        runIfMounted(() => setError(normalizedError));

        if (showToast) {
          toast.error(normalizedError.message);
        }

        throw normalizedError;
      } finally {
        runIfMounted(() => setIsLoading(false));
      }
    },
    [runIfMounted, showToast]
  );

  const get = useCallback(
    (url: string, reqOptions?: AxiosRequestConfig) => request('get', url, null, reqOptions),
    [request]
  );

  const post = useCallback(
    (url: string, payload?: unknown, reqOptions?: AxiosRequestConfig) =>
      request('post', url, payload, reqOptions),
    [request]
  );

  const put = useCallback(
    (url: string, payload?: unknown, reqOptions?: AxiosRequestConfig) =>
      request('put', url, payload, reqOptions),
    [request]
  );

  const del = useCallback(
    (url: string, payload?: unknown, reqOptions?: AxiosRequestConfig) =>
      request('delete', url, payload, reqOptions),
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
      runIfMounted(() => {
        setData(initialState);
        setError(null);
      });
    },
  };
};

export default useAPI;
