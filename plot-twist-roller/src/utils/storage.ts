import type { GameState } from '../types';

const STORAGE_KEY_PREFIX = 'plot-twist-roller-';

/**
 * Save game state to localStorage
 */
export const saveGameState = (username: string, gameState: GameState): boolean => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${username}`;
    const stateToSave = {
      ...gameState,
      username,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    return true;
  } catch (error) {
    console.error('Failed to save game state:', error);
    return false;
  }
};

/**
 * Load game state from localStorage
 */
export const loadGameState = (username: string): GameState | null => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${username}`;
    const savedData = localStorage.getItem(storageKey);

    if (!savedData) {
      return null;
    }

    const gameState = JSON.parse(savedData) as GameState;
    return gameState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

/**
 * Export game state as JSON file
 */
export const exportToFile = (gameState: GameState): void => {
  const dataStr = JSON.stringify(gameState, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `plot-twist-save-${gameState.username}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * Import game state from JSON file
 */
export const importFromFile = (file: File): Promise<GameState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const gameState = JSON.parse(result) as GameState;
          resolve(gameState);
        } else {
          reject(new Error('Failed to read file content'));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Delete saved game state
 */
export const deleteGameState = (username: string): boolean => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${username}`;
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error('Failed to delete game state:', error);
    return false;
  }
};

/**
 * Simple password hashing (client-side only, not secure for real auth)
 */
export const hashPassword = (password: string): string => {
  // Very simple hash - in production, use proper crypto
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
};
