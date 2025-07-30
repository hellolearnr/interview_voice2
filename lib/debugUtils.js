// Utility functions for debugging
export const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data ? data : '');
  }
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    debugLog(`Saved to localStorage: ${key}`, data);
  } catch (error) {
    console.error(`Error saving to localStorage: ${key}`, error);
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      debugLog(`Loaded from localStorage: ${key}`, parsed);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error(`Error loading from localStorage: ${key}`, error);
    return null;
  }
};

export const clearLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    debugLog(`Removed from localStorage: ${key}`);
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
  }
};