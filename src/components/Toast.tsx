import { useEffect, useState } from 'react';
import { X, RotateCcw, CheckCircle, Info, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onUndo?: () => void;
  onClose: (id: string) => void;
}

export default function Toast({ id, message, type, duration = 4000, onUndo, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation
    const timer = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={18} className="text-green-500" />;
      case 'error': return <AlertCircle size={18} className="text-red-500" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 w-full max-w-sm bg-white border border-zinc-200 shadow-lg rounded-lg p-4
        transition-all duration-300 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
      role="alert"
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-grow text-sm font-medium text-zinc-900">{message}</div>

      {onUndo && (
        <button
          onClick={() => {
            onUndo();
            handleClose();
          }}
          className="text-sm font-semibold text-zinc-600 hover:text-black hover:underline px-2"
        >
          <div className="flex items-center gap-1">
             <RotateCcw size={14} />
             Undo
          </div>
        </button>
      )}

      <button
        onClick={handleClose}
        className="text-zinc-400 hover:text-zinc-600 transition-colors ml-1"
      >
        <X size={16} />
      </button>
    </div>
  );
}
