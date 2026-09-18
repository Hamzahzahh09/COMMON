import { writable, get } from 'svelte/store';
import type { Item } from '../api/items.api';

const STORAGE_KEY = 'common_saved_items_v1';

function loadInitialSaved(): Item[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export const savedItems = writable<Item[]>(loadInitialSaved());

// Subscribe to persist
if (typeof window !== 'undefined') {
  savedItems.subscribe((items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignored
    }
  });
}

export function isItemSaved(itemId: string): boolean {
  const current = get(savedItems);
  return current.some((i) => i.id === itemId);
}

export function toggleSaveItem(item: Item): boolean {
  let nowSaved = false;
  savedItems.update((list) => {
    const exists = list.some((i) => i.id === item.id);
    if (exists) {
      nowSaved = false;
      return list.filter((i) => i.id !== item.id);
    } else {
      nowSaved = true;
      return [item, ...list];
    }
  });
  return nowSaved;
}
