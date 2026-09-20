import { useCallback, useState } from 'react';
import { getAPI } from '../utils/axios';

export type HealthCheckResult = {
  status?: 'success' | 'error' | string;
  message?: string;
  error?: string | null;
};

export type HealthCheckState = {
  data: HealthCheckResult | null;
  isLoading: boolean;
  error: string | null;
};

export const useProductHealthCheck = () => {
  const [healthCheck, setHealthCheck] = useState<HealthCheckState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const handleHealthClick = useCallback(async () => {
    setHealthCheck(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await getAPI<HealthCheckResult>('/api/health');
      setHealthCheck({
        data: res,
        isLoading: false,
        error: res?.status === 'error' ? res?.message || 'Health check failed' : null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to perform health check';
      console.error('Error during health check:', error);
      setHealthCheck({ data: null, isLoading: false, error: message });
    }
  }, []);

  return {
    healthCheck,
    handleHealthClick,
  };
};

export default useProductHealthCheck;
