import { useCallback, useEffect, useState } from 'react';

interface ToastItem {
  id: number;
  message: string;
  variant: 'success' | 'warning' | 'error';
}

let nextId = 0;

const VARIANT_STYLES: Record<string, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  error: 'border-red-200 bg-red-50 text-red-800',
};

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, variant: 'success' | 'warning' | 'error') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    const handle = (e: Event) => {
      const { message, variant } = (e as CustomEvent).detail;
      addToast(message, variant || 'warning');
    };
    window.addEventListener('toast:show', handle);
    return () => window.removeEventListener('toast:show', handle);
  }, [addToast]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between gap-3 rounded-md border px-4 py-3 shadow-lg ${VARIANT_STYLES[toast.variant]}`}
        >
          <p className="text-sm">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            className="text-current opacity-50 hover:opacity-100"
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}
