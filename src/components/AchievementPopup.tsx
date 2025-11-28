import { Trophy, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AchievementPopupProps {
  title: string;
  description: string;
  onClose: () => void;
}

export default function AchievementPopup({ title, description, onClose }: AchievementPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-4 shadow-sm">
            <Trophy size={32} strokeWidth={1.5} />
          </div>

          <h2 className="text-xl font-bold text-zinc-900 mb-1">Achievement Unlocked!</h2>
          <h3 className="text-lg font-semibold text-indigo-600 mb-2">{title}</h3>
          <p className="text-zinc-500 text-sm mb-6">{description}</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 btn-pro btn-secondary py-2.5 text-sm"
            >
              Close
            </button>
            <Link
              to="/achievements"
              className="flex-1 btn-pro btn-primary py-2.5 text-sm text-center"
            >
              View Achievements
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
