import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const typeStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  const icons = {
    success: '✅',
    error: '❌', 
    info: 'ℹ️'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded border ${typeStyles[type]} shadow-lg animate-slide-in`}>
      <div className="flex items-center gap-2">
        <span>{icons[type]}</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 font-bold">×</button>
      </div>
    </div>
  );
}
