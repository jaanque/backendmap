import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { createOrganization, checkOrganizationSlugAvailability } from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Building2, Save, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '../lib/toast';

export default function CreateOrganization() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    // Auto-generate slug if not manually edited yet (simplified logic)
    if (!slug || slug === val.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, val.length - 1)) {
        handleSlugChange({ target: { value: val } } as any);
    }
  };

  const handleSlugChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(val);
    setSlugAvailable(null);

    if (val.length > 2) {
      setIsCheckingSlug(true);
      try {
        const isAvailable = await checkOrganizationSlugAvailability(val);
        setSlugAvailable(isAvailable);
      } catch (error) {
        console.error(error);
      } finally {
        setIsCheckingSlug(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!slugAvailable) return;

    setIsSubmitting(true);
    try {
      await createOrganization({
        name,
        slug,
        description,
        owner_id: user.id
      });
      showToast('Organization created successfully!', { type: 'success' });
      navigate(`/org/${slug}`);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Failed to create organization', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white  font-sans text-zinc-900  flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-grow px-6 md:px-12 py-12 w-full max-w-2xl mx-auto animate-fade-in-up">
        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-zinc-100  rounded-xl flex items-center justify-center mx-auto mb-4 text-zinc-600 ">
            <Building2 size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 ">Create Organization</h1>
          <p className="text-zinc-500  mt-2">Establish a new organization to collaborate with your team.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white  p-8 rounded-2xl border border-zinc-200  shadow-sm">
          <div>
            <label className="block text-sm font-bold text-zinc-700  mb-2">Organization Name</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              required
              placeholder="e.g. Acme Corp"
              className="w-full px-4 py-3 rounded-lg border border-zinc-200  bg-white  focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700  mb-2">Slug (URL)</label>
            <div className="relative">
                <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                required
                placeholder="acme-corp"
                className={`w-full px-4 py-3 rounded-lg border bg-white  outline-none transition-all text-sm ${
                    slugAvailable === false
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : slugAvailable === true
                    ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
                    : 'border-zinc-200  focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isCheckingSlug ? (
                        <Loader2 size={16} className="animate-spin text-zinc-400" />
                    ) : slugAvailable === true ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                    ) : slugAvailable === false ? (
                        <XCircle size={16} className="text-red-500" />
                    ) : null}
                </div>
            </div>
            {slug && (
                <p className="mt-2 text-xs text-zinc-500">
                    Your organization will be accessible at: <span className="font-mono text-zinc-700 ">backendmap.io/org/{slug}</span>
                </p>
            )}
            {slugAvailable === false && (
                <p className="mt-1 text-xs text-red-500">This slug is already taken.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700  mb-2">Description <span className="font-normal text-zinc-400">(Optional)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What is this organization about?"
              className="w-full px-4 py-3 rounded-lg border border-zinc-200  bg-white  focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !slug || slugAvailable === false}
              className="w-full btn-pro btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSubmitting ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
