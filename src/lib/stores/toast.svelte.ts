export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toasts = $state<ToastItem[]>([]);
let counter = 0;

export const toastStack = {
  get current() { return toasts; },

  add(message: string, type: ToastType = 'success', duration = 3000) {
    const id = counter++;
    toasts.push({ id, message, type });

    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
    }, duration);
  }
};