import React from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, Users, Briefcase, Zap, Shield, Play, Code, Palette, Music, FileText, Repeat, TrendingUp, Layers, Terminal, Megaphone, Languages, GraduationCap, TrendingUp as TrendingIcon } from "lucide-react";
import { SKILLS, USERS } from "../data/mockData";
import SkillCard from "../components/shared/SkillCard";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { useAuth } from "../contexts/AuthContext";

// Animated Stat Component
interface AnimatedStatProps {
  stat: {
    label: string;
    value: string;
    suffix: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  delay: number;
  key?: React.Key;
}

function AnimatedStat({ stat, delay }: AnimatedStatProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  
  const Icon = stat.icon;
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      {/* Glowing lavender icon */}
      <div className="flex justify-center mb-3">
        <div className="relative">
          <div className="absolute inset-0 blur-lg bg-violet-500/30 rounded-full animate-pulse" />
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center">
            <Icon className="w-4 h-4 text-violet-400" />
          </div>
        </div>
      </div>
      
      {/* Animated number */}
      <div className="text-3xl md:text-4xl font-bold text-white mb-2 leading-none">
        {inView && (
          <CountUp
            start={0}
            end={parseInt(stat.value)}
            duration={2.5}
            delay={delay}
            suffix={stat.suffix}
            separator=","
          />
        )}
      </div>
      
      {/* Label */}
      <div className="text-sm text-slate-500 font-medium uppercase tracking-widest">
        {stat.label}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartSwapping = () => {
    if (user) {
      navigate('/explore');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-8 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Zap className="w-3 h-3" />
              Join over 1,200 learners trading skills without money
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Trade what you know <br />
              <span className="bg-gradient-to-r from-violet-400 to-white bg-clip-text text-transparent">for what you want to learn</span>
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-lg leading-relaxed opacity-80">
              Connect with others, swap skills, and grow together. No money needed, just passion and knowledge.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleStartSwapping}
                className="btn-primary group flex items-center gap-2"
              >
                Start Swapping
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link to="/explore" className="btn-secondary flex items-center gap-2">
                Explore Skills
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#0f172a] glass flex items-center justify-center text-white">
                  <Code className="w-4 h-4" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0f172a] glass flex items-center justify-center text-white">
                  <Palette className="w-4 h-4" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0f172a] glass flex items-center justify-center text-white">
                  <Music className="w-4 h-4" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0f172a] glass flex items-center justify-center text-white">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-sm text-slate-400">
                <div className="flex items-center gap-1 text-yellow-400 font-bold mb-0.5">
                  <Star className="w-4 h-4 fill-current" />
                  4.9/5
                </div>
                Use Diverse skills from a passionate community
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 glass-card p-4 aspect-video overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop" 
                alt="Community" 
                className="rounded-xl w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center pl-1 shadow-2xl">
                  <Play className="w-6 h-6 fill-current" />
                </button>
              </div>
            </div>
            {/* Decals */}
            <div className="absolute -bottom-6 -left-6 glass p-4 rounded-xl z-20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Active Matches</div>
                <div className="text-lg font-bold text-white">1,248</div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 glass p-4 rounded-xl z-20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Skills Available</div>
                <div className="text-lg font-bold text-white">25,482</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "10000", suffix: "+", icon: Users },
              { label: "Skills Swapped", value: "25000", suffix: "+", icon: Repeat },
              { label: "Success Rate", value: "98", suffix: "%", icon: TrendingUp },
              { label: "Skill Categories", value: "50", suffix: "+", icon: Layers },
            ].map((stat, idx) => (
              <AnimatedStat key={idx} stat={stat} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills Preview */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Skills</h2>
            <p className="text-slate-400 max-w-xl">Join the most active community of experts swapping knowledge daily. See what's popular right now.</p>
          </div>
          <Link to="/explore" className="btn-secondary text-sm">
            View All Skills
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full">
          {/* Card 1: Full-Stack React Development - The Tech Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300 relative group h-full"
          >
            {/* New/Live Badge */}
            <div className="absolute -top-2 -left-2 z-10">
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-xs font-bold text-white animate-pulse">
                <Zap className="w-3 h-3" />
                New
              </div>
            </div>
            
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 blur-lg bg-cyan-500/30 rounded-full animate-pulse" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-2">Full-Stack React Development</h3>
              <p className="text-sm text-slate-400 mb-4">Build modern web apps from scratch</p>
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs font-medium text-cyan-300">
                <Star className="w-3 h-3 fill-current" />
                Top Rated
              </div>
            </div>
          </motion.div>

          {/* Card 2: Digital Marketing & SEO - The Business Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 relative group h-full"
          >
            {/* Trending Badge */}
            <div className="absolute -top-2 -right-2 z-10">
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full text-xs font-bold text-white animate-pulse">
                <TrendingIcon className="w-3 h-3" />
                Trending
              </div>
            </div>
            
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 blur-lg bg-emerald-500/30 rounded-full animate-pulse" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-2">Digital Marketing & SEO</h3>
              <p className="text-sm text-slate-400 mb-4">Master social media growth strategies</p>
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-medium text-emerald-300">
                <TrendingIcon className="w-3 h-3" />
                High Demand
              </div>
            </div>
          </motion.div>

          {/* Card 3: Business English & Fluency - The Education Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300 relative group"
          >
            {/* Trending Badge */}
            <div className="absolute -top-2 -right-2 z-10">
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-xs font-bold text-white animate-pulse">
                <TrendingIcon className="w-3 h-3" />
                Trending
              </div>
            </div>
            
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 blur-lg bg-amber-500/30 rounded-full animate-pulse" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                  <Languages className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-2">Business English & Fluency</h3>
              <p className="text-sm text-slate-400 mb-4">Improve your professional communication</p>
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs font-medium text-amber-300">
                <Repeat className="w-3 h-3" />
                Most Swapped
              </div>
            </div>
          </motion.div>
        </div>
      </section>

          </div>
  );
}
