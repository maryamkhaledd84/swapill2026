import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ComingSoonLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => toast(`${label} is coming soon`)}
      className="hover:text-purple-400 transition-colors text-left"
    >
      {label}
    </button>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    if (!EMAIL_RE.test(email.trim())) {
      toast.error('Please enter a valid email');
      return;
    }
    setSubmitting(true);
    // No mailing list backend yet — acknowledge honestly.
    toast.success("Thanks — we'll let you know when the newsletter launches");
    setEmail('');
    setSubmitting(false);
  };

  return (
    <footer className="border-t border-white/5 bg-slate-950/50 backdrop-blur-sm py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Swapill</span>
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            The premium platform for bartering skills in a modern digital world. Join thousands of experts today.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-500 transition-all duration-300 hover:scale-110"
            >
              <Github className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-500 transition-all duration-300 hover:scale-110"
            >
              <Linkedin className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-500 transition-all duration-300 hover:scale-110"
            >
              <Twitter className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Platform</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li>
              <Link to="/explore" className="hover:text-purple-400 transition-colors">
                Explore Skills
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-purple-400 transition-colors">
                How It Works
              </Link>
            </li>
            <li><ComingSoonLink label="Pro Plans" /></li>
            <li><ComingSoonLink label="Community" /></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><ComingSoonLink label="Help Center" /></li>
            <li><ComingSoonLink label="Safety Tips" /></li>
            <li><ComingSoonLink label="Community Guidelines" /></li>
            <li>
              <a href="mailto:hello@swapill.app" className="hover:text-purple-400 transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Newsletter</h4>
          <p className="text-gray-300 text-sm mb-4">Get weekly updates on popular skills and expert stories.</p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 flex-grow w-full sm:w-auto"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} Swapill. All rights reserved.
      </div>
    </footer>
  );
}
