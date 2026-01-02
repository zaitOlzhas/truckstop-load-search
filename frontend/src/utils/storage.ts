import { TruckStopConfig } from '@/types/api';

const CONFIG_STORAGE_KEY = 'truckstop_config';

/**
 * Save configuration to localStorage
 */
export function saveConfig(config: TruckStopConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  }
}

/**
 * Load configuration from localStorage
 */
export function loadConfig(): TruckStopConfig | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        const config = JSON.parse(stored);
        // Ensure integrationId is always a string (migration from old number format)
        if (config.integrationId !== undefined) {
          config.integrationId = String(config.integrationId);
        }
        return config;
      } catch (e) {
        console.error('Failed to parse stored config:', e);
        return null;
      }
    }
  }
  return null;
}

/**
 * Clear configuration from localStorage
 */
export function clearConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  }
}
