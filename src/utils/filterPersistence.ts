interface FilterData {
  [key: string]: any;
  savedAt: string;
}

export const FilterPersistence = {
  /**
   * Save filters to localStorage with timestamp
   */
  save: (filters: any, key: string = 'scout-dashboard-filters') => {
    try {
      const filterData: FilterData = {
        ...filters,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(filterData));
      return true;
    } catch (error) {
      console.error('Failed to save filters:', error);
      return false;
    }
  },

  /**
   * Load filters from localStorage with expiration check
   */
  load: (key: string = 'scout-dashboard-filters', expirationHours: number = 24) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;
      
      const parsed: FilterData = JSON.parse(saved);
      const savedDate = new Date(parsed.savedAt);
      const now = new Date();
      
      // Check if filters have expired
      const hoursDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);
      if (hoursDiff > expirationHours) {
        localStorage.removeItem(key);
        return null;
      }
      
      // Remove the savedAt timestamp before returning
      const { savedAt, ...filters } = parsed;
      return filters;
    } catch (error) {
      console.error('Failed to load filters:', error);
      // Remove corrupted data
      localStorage.removeItem(key);
      return null;
    }
  },

  /**
   * Clear saved filters
   */
  clear: (key: string = 'scout-dashboard-filters') => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to clear filters:', error);
      return false;
    }
  },

  /**
   * Save filter preset with custom name
   */
  savePreset: (filters: any, presetName: string) => {
    try {
      const presetsKey = 'scout-filter-presets';
      const existingPresets = JSON.parse(localStorage.getItem(presetsKey) || '{}');
      
      existingPresets[presetName] = {
        ...filters,
        createdAt: new Date().toISOString(),
        name: presetName
      };
      
      localStorage.setItem(presetsKey, JSON.stringify(existingPresets));
      return true;
    } catch (error) {
      console.error('Failed to save filter preset:', error);
      return false;
    }
  },

  /**
   * Load filter preset by name
   */
  loadPreset: (presetName: string) => {
    try {
      const presetsKey = 'scout-filter-presets';
      const presets = JSON.parse(localStorage.getItem(presetsKey) || '{}');
      
      if (presets[presetName]) {
        const { createdAt, name, ...filters } = presets[presetName];
        return filters;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to load filter preset:', error);
      return null;
    }
  },

  /**
   * Get all saved filter presets
   */
  getAllPresets: () => {
    try {
      const presetsKey = 'scout-filter-presets';
      const presets = JSON.parse(localStorage.getItem(presetsKey) || '{}');
      
      return Object.keys(presets).map(name => ({
        name,
        createdAt: presets[name].createdAt,
        filters: presets[name]
      }));
    } catch (error) {
      console.error('Failed to get filter presets:', error);
      return [];
    }
  },

  /**
   * Delete a filter preset
   */
  deletePreset: (presetName: string) => {
    try {
      const presetsKey = 'scout-filter-presets';
      const presets = JSON.parse(localStorage.getItem(presetsKey) || '{}');
      
      delete presets[presetName];
      localStorage.setItem(presetsKey, JSON.stringify(presets));
      return true;
    } catch (error) {
      console.error('Failed to delete filter preset:', error);
      return false;
    }
  },

  /**
   * Auto-save filters when they change (debounced)
   */
  autoSave: (() => {
    let timeout: NodeJS.Timeout;
    
    return (filters: any, delay: number = 1000) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        FilterPersistence.save(filters);
      }, delay);
    };
  })(),

  /**
   * Check if localStorage is available
   */
  isAvailable: () => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get storage usage info
   */
  getStorageInfo: () => {
    if (!FilterPersistence.isAvailable()) {
      return { available: false, used: 0, remaining: 0 };
    }

    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }

      // Rough estimate of localStorage limit (5MB in most browsers)
      const limit = 5 * 1024 * 1024; // 5MB in bytes
      
      return {
        available: true,
        used: used,
        remaining: limit - used,
        usedKB: Math.round(used / 1024),
        remainingKB: Math.round((limit - used) / 1024),
        percentUsed: Math.round((used / limit) * 100)
      };
    } catch (error) {
      return { available: false, used: 0, remaining: 0, error: error.message };
    }
  },

  /**
   * Clean up old filter data
   */
  cleanup: (maxAgeHours: number = 168) => { // 1 week default
    try {
      const keys = Object.keys(localStorage);
      const now = new Date();
      let cleaned = 0;

      keys.forEach(key => {
        if (key.includes('scout-') || key.includes('filter')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            if (data.savedAt || data.createdAt) {
              const savedDate = new Date(data.savedAt || data.createdAt);
              const hoursDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);
              
              if (hoursDiff > maxAgeHours) {
                localStorage.removeItem(key);
                cleaned++;
              }
            }
          } catch {
            // Invalid JSON, remove it
            localStorage.removeItem(key);
            cleaned++;
          }
        }
      });

      return { cleaned, remaining: keys.length - cleaned };
    } catch (error) {
      console.error('Failed to cleanup filters:', error);
      return { cleaned: 0, remaining: 0, error: error.message };
    }
  }
};

export default FilterPersistence;