import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrganizationBySlug } from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Building2, Calendar, MapPin, Link as LinkIcon, Users as UsersIcon } from 'lucide-react';
import type { Organization } from '../types';

export default function OrganizationProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getOrganizationBySlug(slug)
      .then(setOrg)
      .catch((err) => {
        console.error(err);
        setError('Organization not found');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Organization Not Found</h1>
            <p className="text-zinc-500 dark:text-zinc-400">The organization you are looking for does not exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-grow animate-fade-in-up">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 w-full relative">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-16 relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Logo */}
                <div className="w-32 h-32 rounded-2xl bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-950 shadow-xl flex items-center justify-center flex-shrink-0">
                    <Building2 size={48} className="text-indigo-600 dark:text-indigo-400" />
                </div>

                <div className="flex-grow pt-4 md:pt-16">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{org.name}</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-2xl">
                        {org.description || 'No description provided.'}
                    </p>

                    <div className="flex flex-wrap gap-6 mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                            <UsersIcon size={16} />
                            <span>1 Member</span> {/* Placeholder for now */}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>Joined {new Date(org.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16">
                <div className="border-b border-zinc-200 dark:border-zinc-800 mb-8">
                    <nav className="flex gap-8">
                        <button className="pb-4 border-b-2 border-indigo-600 text-indigo-600 font-medium text-sm">
                            Overview
                        </button>
                        <button className="pb-4 border-b-2 border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors font-medium text-sm">
                            Scenarios
                        </button>
                        <button className="pb-4 border-b-2 border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors font-medium text-sm">
                            Members
                        </button>
                    </nav>
                </div>

                <div className="py-8 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl">
                    <p className="text-zinc-400 dark:text-zinc-500">No public content available yet.</p>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
