import { useState } from 'react';
import { X, Flag, Loader2, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, description: string) => Promise<void>;
  title: string;
  isSubmitting?: boolean;
}

const REPORT_REASONS = [
  'Inappropriate Content',
  'Spam',
  'Harassment',
  'Misinformation',
  'Other'
];

export default function ReportModal({ isOpen, onClose, onSubmit, title, isSubmitting = false }: ReportModalProps) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(reason, description);
    setDescription('');
    setReason(REPORT_REASONS[0]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
           <h3 className="font-bold text-lg text-zinc-900 flex items-center gap-2">
             <Flag size={18} className="text-red-500" />
             {title}
           </h3>
           <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
             <X size={20} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3 mb-4">
              <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
              <p className="text-xs text-amber-800 leading-relaxed">
                Reports are taken seriously. Please only submit a report if you believe this content violates our community guidelines.
              </p>
           </div>

           <div>
             <label className="block text-sm font-medium text-zinc-700 mb-1.5">Reason</label>
             <select
               value={reason}
               onChange={(e) => setReason(e.target.value)}
               className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm bg-white"
             >
               {REPORT_REASONS.map(r => (
                 <option key={r} value={r}>{r}</option>
               ))}
             </select>
           </div>

           <div>
             <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description (Optional)</label>
             <textarea
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               rows={4}
               placeholder="Please provide more details..."
               className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm resize-none"
             />
           </div>

           <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-pro bg-red-600 hover:bg-red-700 text-white px-6 py-2 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Flag size={16} />}
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
