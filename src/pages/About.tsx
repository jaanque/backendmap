import { Link } from 'react-router-dom';
import { Layers, Github, Twitter, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-black selection:text-white">
      {/* Navbar - Reused from Home/Explore */}
      <nav className="border-b border-zinc-100 h-16 flex items-center justify-between px-6 md:px-12 sticky top-0 bg-white/90 backdrop-blur z-50">
        <Link to="/" className="font-bold text-xl tracking-tight flex items-center gap-2 text-zinc-900 hover:text-black transition-colors">
          BackendMap
        </Link>
        <div className="flex gap-6 text-sm font-medium text-zinc-500">
          <Link to="/explore" className="hover:text-black transition-colors">Explore Scenarios</Link>
          <Link to="/about" className="text-black transition-colors">About</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-zinc-900">
          Demystifying the <br/>
          <span className="text-zinc-400">Invisible Backend.</span>
        </h1>
        <p className="text-xl text-zinc-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          BackendMap is an interactive learning platform designed to help developers visualize, understand, and master modern system architectures.
        </p>
      </header>

      {/* Mission / Content */}
      <main className="px-6 md:px-12 pb-32 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900">The Problem</h2>
            <p className="text-zinc-600 leading-relaxed">
              Backend development often feels abstract. Unlike frontend, where you can see your changes instantly, backend systems involve invisible data flows, complex race conditions, and distributed services that are hard to visualize mentally.
            </p>
            <p className="text-zinc-600 leading-relaxed">
              Traditional diagrams are static. They don't show you what happens *during* a request, how a database lock behaves, or what payload a webhook actually delivers.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900">Our Solution</h2>
            <p className="text-zinc-600 leading-relaxed">
              We believe in learning by doing—and seeing. BackendMap provides **interactive simulations** of real-world architectural patterns.
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-900" />
                </div>
                <span className="text-zinc-600">Step-by-step execution of API requests.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-900" />
                </div>
                <span className="text-zinc-600">Visual feedback for active nodes and data paths.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-900" />
                </div>
                <span className="text-zinc-600">Curated scenarios from simple CRUD to microservices.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Team / Context */}
        <div className="mt-24 pt-12 border-t border-zinc-100 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Open Source & Community</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto mb-8">
            BackendMap is built by developers, for developers. We are constantly adding new scenarios based on real-world engineering challenges.
          </p>
          <div className="flex justify-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-pro btn-secondary px-6 py-3">
              <Github className="w-4 h-4 mr-2" />
              Contribute on GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn-pro btn-secondary px-6 py-3">
              <Twitter className="w-4 h-4 mr-2" />
              Follow Updates
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 bg-zinc-50 rounded-2xl p-12 text-center border border-zinc-100">
           <h2 className="text-3xl font-bold text-zinc-900 mb-4">Ready to explore?</h2>
           <p className="text-zinc-500 mb-8">Dive into our catalog of interactive backend scenarios.</p>
           <Link to="/explore" className="btn-pro btn-primary px-8 py-4 text-lg shadow-lg shadow-zinc-200">
             Start Learning <ArrowRight className="ml-2 w-5 h-5" />
           </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
