import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
};

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function show(message: string, type: ToastType = 'info', duration: number = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, message, duration };

    update((all) => [...all, toast]);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }

  function dismiss(id: string) {
    update((all) => all.filter((t) => t.id !== id));
  }

  return {
    subscribe,
    show,
    success: (msg: string, duration?: number) => show(msg, 'success', duration),
    error: (msg: string, duration?: number) => show(msg, 'error', duration),
    info: (msg: string, duration?: number) => show(msg, 'info', duration),
    dismiss,
  };
}

export const toast = createToastStore();
