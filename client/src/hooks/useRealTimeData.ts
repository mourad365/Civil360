import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook for real-time data updates using polling
 * Optimized for construction IoT data, equipment status, and live monitoring
 */
export function useRealTimeData(
  queryKey: string | string[],
  intervalMs: number = 5000,
  options?: {
    enabled?: boolean;
    onUpdate?: (data: any) => void;
    onError?: (error: any) => void;
    maxRetries?: number;
    backoffMultiplier?: number;
  }
) {
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const lastDataRef = useRef<any>(null);

  const {
    enabled = true,
    onUpdate,
    onError,
    maxRetries = 3,
    backoffMultiplier = 1.5,
  } = options || {};

  const keyArray = Array.isArray(queryKey) ? queryKey : [queryKey];

  // Get initial data
  const { data, error, isLoading } = useQuery({
    queryKey: keyArray,
    enabled: enabled,
    refetchOnWindowFocus: false,
    staleTime: intervalMs / 2, // Consider data stale at half the interval
  });

  useEffect(() => {
    if (!enabled) return;

    const pollData = async () => {
      try {
        // Fetch fresh data
        const freshData = await queryClient.fetchQuery({
          queryKey: keyArray,
          staleTime: 0, // Always fetch fresh data
        });

        // Check if data has actually changed
        const dataChanged = JSON.stringify(freshData) !== JSON.stringify(lastDataRef.current);
        
        if (dataChanged) {
          lastDataRef.current = freshData;
          onUpdate?.(freshData);
          
          // Reset retry count on successful update
          retryCountRef.current = 0;
        }

        // Set next poll interval
        intervalRef.current = setTimeout(pollData, intervalMs);

      } catch (err) {
        console.warn('Real-time data polling error:', err);
        onError?.(err);

        // Implement exponential backoff on errors
        retryCountRef.current++;
        
        if (retryCountRef.current <= maxRetries) {
          const backoffDelay = intervalMs * Math.pow(backoffMultiplier, retryCountRef.current);
          intervalRef.current = setTimeout(pollData, Math.min(backoffDelay, 60000)); // Max 1 minute
        } else {
          console.error('Max retries exceeded for real-time data polling');
        }
      }
    };

    // Start polling after initial load
    if (data && !isLoading) {
      lastDataRef.current = data;
      intervalRef.current = setTimeout(pollData, intervalMs);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, intervalMs, queryClient, onUpdate, onError, maxRetries, backoffMultiplier, data, isLoading]);

  // Handle page visibility changes - pause polling when page is hidden
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - clear polling
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Page is visible - resume polling if not already active
        if (!intervalRef.current && data) {
          const pollData = async () => {
            try {
              const freshData = await queryClient.fetchQuery({
                queryKey: keyArray,
                staleTime: 0,
              });

              const dataChanged = JSON.stringify(freshData) !== JSON.stringify(lastDataRef.current);
              
              if (dataChanged) {
                lastDataRef.current = freshData;
                onUpdate?.(freshData);
                retryCountRef.current = 0;
              }

              intervalRef.current = setTimeout(pollData, intervalMs);
            } catch (err) {
              console.warn('Real-time data polling error on resume:', err);
              onError?.(err);
              
              retryCountRef.current++;
              if (retryCountRef.current <= maxRetries) {
                const backoffDelay = intervalMs * Math.pow(backoffMultiplier, retryCountRef.current);
                intervalRef.current = setTimeout(pollData, Math.min(backoffDelay, 60000));
              }
            }
          };

          intervalRef.current = setTimeout(pollData, 1000); // Resume quickly
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, intervalMs, queryClient, onUpdate, onError, maxRetries, backoffMultiplier, data]);

  return {
    data,
    error,
    isLoading,
    isPolling: intervalRef.current !== null,
    retryCount: retryCountRef.current,
  };
}

/**
 * Specialized hook for IoT equipment real-time monitoring
 */
export function useIoTRealTime(intervalMs: number = 3000) {
  return useRealTimeData('/api/iot/equipment', intervalMs, {
    onUpdate: (data) => {
      // Handle equipment status changes
      if (Array.isArray(data)) {
        const offlineEquipment = data.filter(eq => eq.status === 'offline');
        const criticalBattery = data.filter(eq => eq.batteryLevel && eq.batteryLevel < 20);
        
        // Could trigger notifications here
        if (offlineEquipment.length > 0) {
          console.warn(`${offlineEquipment.length} equipment(s) offline`);
        }
        
        if (criticalBattery.length > 0) {
          console.warn(`${criticalBattery.length} equipment(s) with low battery`);
        }
      }
    },
    onError: (error) => {
      console.error('IoT real-time monitoring error:', error);
    },
    maxRetries: 5,
    backoffMultiplier: 1.2,
  });
}

/**
 * Specialized hook for AI analysis progress monitoring
 */
export function useAiAnalysisRealTime(intervalMs: number = 2000) {
  return useRealTimeData('/api/ai/analysis', intervalMs, {
    onUpdate: (analyses) => {
      if (Array.isArray(analyses)) {
        const processing = analyses.filter(a => a.status === 'processing');
        const completed = analyses.filter(a => a.status === 'completed' && a.progress === 100);
        
        // Log completion events
        completed.forEach(analysis => {
          if (analysis.aiConfidence) {
            console.log(`AI analysis completed: ${analysis.fileName} (${(parseFloat(analysis.aiConfidence) * 100).toFixed(1)}% confidence)`);
          }
        });
      }
    },
    onError: (error) => {
      console.error('AI analysis real-time monitoring error:', error);
    },
    maxRetries: 3,
    backoffMultiplier: 2,
  });
}

/**
 * Specialized hook for quality check real-time updates
 */
export function useQualityRealTime(intervalMs: number = 8000) {
  return useRealTimeData('/api/quality/checks', intervalMs, {
    onUpdate: (checks) => {
      if (Array.isArray(checks)) {
        const failedChecks = checks.filter(c => c.status === 'failed');
        const recentFailed = failedChecks.filter(c => {
          if (!c.createdAt) return false;
          const checkDate = new Date(c.createdAt);
          const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
          return checkDate > hourAgo;
        });
        
        if (recentFailed.length > 0) {
          console.warn(`${recentFailed.length} new quality check failure(s) in the last hour`);
        }
      }
    },
    onError: (error) => {
      console.error('Quality check real-time monitoring error:', error);
    },
    maxRetries: 2,
    backoffMultiplier: 1.5,
  });
}

/**
 * Hook for dashboard statistics real-time updates
 */
export function useDashboardRealTime(intervalMs: number = 15000) {
  return useRealTimeData('/api/dashboard/stats', intervalMs, {
    onUpdate: (stats) => {
      // Log significant changes in key metrics
      if (stats.qualityAlerts > 10) {
        console.warn(`High number of quality alerts: ${stats.qualityAlerts}`);
      }
      
      if (stats.productivityGain < 0) {
        console.warn(`Productivity decline: ${stats.productivityGain}%`);
      }
    },
    maxRetries: 2,
  });
}

export default useRealTimeData;
