import { useEffect, useState } from 'react';
import { getNotifications, markNotificationsRead } from '../lib/api';
import { useAuth } from '../lib/auth';
import type { Notification } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, GitFork, User, Clock, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Activity() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getNotifications(user.id)
        .then(data => {
            setNotifications(data);
            if (data.some(n => !n.is_read)) {
                markNotificationsRead(user.id);
            }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
  }, [user]);

  const timeAgo = (date: string) => {
      const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + " years ago";
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + " months ago";
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + " days ago";
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + " hours ago";
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + " minutes ago";
      return Math.floor(seconds) + " seconds ago";
  }

  if (!user) {
      return (
        <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-black selection:text-white">
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <p>Please log in to view activity.</p>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-black selection:text-white">
      <Navbar />

      <main className="px-4 md:px-12 py-12 max-w-3xl mx-auto animate-fade-in-up">
        <div id="main-content" className="mb-8 border-b border-zinc-100 pb-4">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Activity</h1>
          <p className="text-zinc-500 text-sm">Stay updated with interactions on your scenarios.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
             <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/30">
             <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <Bell size={20} />
             </div>
             <p className="text-zinc-500 font-medium">No activity yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${!notif.is_read ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-zinc-100'}`}
              >
                 <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                     notif.type === 'favorite' ? 'bg-red-50 text-red-500' :
                     notif.type === 'fork' ? 'bg-indigo-50 text-indigo-500' :
                     'bg-blue-50 text-blue-500'
                 }`}>
                     {notif.type === 'favorite' && <Heart size={14} fill="currentColor" />}
                     {notif.type === 'fork' && <GitFork size={14} />}
                     {notif.type === 'follow' && <User size={14} />}
                 </div>

                 <div className="flex-grow">
                     <p className="text-sm text-zinc-800 leading-relaxed">
                        <span className="font-semibold">{notif.actor?.first_name || 'Someone'}</span>
                        {' '}
                        {notif.type === 'favorite' && 'favorited your scenario'}
                        {notif.type === 'fork' && 'forked your scenario'}
                        {notif.type === 'follow' && 'started following you'}
                        {' '}
                        {notif.resource && (
                            <Link to={`/map/${notif.resource.slug}`} className="font-medium text-indigo-600 hover:underline">
                                {notif.resource.title}
                            </Link>
                        )}
                     </p>
                     <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                        <Clock size={10} />
                        {timeAgo(notif.created_at)}
                     </p>
                 </div>

                 {!notif.is_read && (
                     <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                 )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
