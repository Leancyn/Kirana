const memoryStorage = new Map();

const getLocalStorage = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage ?? null;
};

export const appStorage = {
  getItem: (key) => {
    const storage = getLocalStorage();
    return storage ? storage.getItem(key) : (memoryStorage.get(key) ?? null);
  },
  setItem: (key, value) => {
    const storage = getLocalStorage();
    if (storage) {
      storage.setItem(key, value);
      return;
    }
    memoryStorage.set(key, value);
  },
  removeItem: (key) => {
    const storage = getLocalStorage();
    if (storage) {
      storage.removeItem(key);
      return;
    }
    memoryStorage.delete(key);
  },
};
