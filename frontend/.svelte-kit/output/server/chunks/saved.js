import { w as writable } from "./index2.js";
const STORAGE_KEY = "common_saved_items_v1";
function loadInitialSaved() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
const savedItems = writable(loadInitialSaved());
if (typeof window !== "undefined") {
  savedItems.subscribe((items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
    }
  });
}
export {
  savedItems as s
};
