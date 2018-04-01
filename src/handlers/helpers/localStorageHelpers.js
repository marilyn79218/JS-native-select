export const getFromLs = (key) => JSON.parse(localStorage.getItem(key));
export const setToLs = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const removeFromLs = (key) => localStorage.removeItem(key);
