import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}>
                <AlertTriangle size={24} />
            </div>

            <h3 className="font-bold text-lg text-zinc-900 mb-2">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">{message}</p>

            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors"
                >
                    {cancelText}
                </button>
                <button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white shadow-sm transition-colors ${
                        isDestructive
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {confirmText}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
