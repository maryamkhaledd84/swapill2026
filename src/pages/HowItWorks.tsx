import { motion } from "motion/react";
import { UserPlus, Sparkles, Handshake, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your profile",
    desc: "Tell the community what you're an expert at and what you want to learn. Showcase your portfolio and build credibility.",
    color: "bg-blue-500",
  },
  {
    icon: Sparkles,
    title: "Add your skills",
    desc: "List your skills across categories like Design, Development, Music, Marketing, and more. Be specific about your expertise level.",
    color: "bg-purple-500",
  },
  {
    icon: Handshake,
    title: "Find your match",
    desc: "Our smart matching system connects you with the perfect learning partners based on skills, availability, and goals.",
    color: "bg-pink-500",
  },
  {
    icon: MessageCircle,
    title: "Start swapping",
    desc: "Connect via secure chat, agree on swap terms, schedule sessions, and start learning. Build your reputation with every exchange.",
    color: "bg-orange-500",
  }
];

export default function HowItWorks() {
  return (
    <div className="pt-8 pb-24 max-w-5xl mx-auto px-6">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">How Swapill Works</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Swap skills without spending money. Learn from Egyptian experts and share your expertise with our growing community.
        </p>
      </div>

      <div className="relative space-y-12">
        {/* Connection Line — stops short of the last step so the gradient
            tapers naturally instead of dangling past Step 04 */}
        <div className="absolute left-[39px] md:left-1/2 top-10 bottom-24 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-purple-500/10 hidden md:block" />

        {STEPS.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="flex-1 w-full">
               <div className={`p-8 glass-card border-none ring-1 ring-white/5 hover:ring-purple-500/30 transition-all ${idx % 2 !== 0 ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.desc}</p>
               </div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className={`w-20 h-20 rounded-full ${step.color} bg-opacity-20 flex items-center justify-center ring-8 ring-[#0f172a] shadow-xl shadow-purple-500/10`}>
                <step.icon className={`w-8 h-8 ${step.color.replace('bg-', 'text-')}`} />
              </div>
              {/* Step label as a pill that sits cleanly over the connecting line */}
              <div className="mt-3 hidden md:block">
                <span className="inline-block bg-[#0f172a] px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Step 0{idx + 1}
                </span>
              </div>
            </div>

            <div className="flex-1 hidden md:block" />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-24 p-12 glass-card text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 -z-10" />
        <h2 className="text-3xl font-bold mb-6">Ready to start swapping?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join thousands of Egyptian professionals and experts who are already learning new skills without spending money.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/explore" className="btn-primary flex items-center gap-2 w-full sm:w-auto">
            Explore Skills First
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/signup" className="btn-secondary w-full sm:w-auto">
            Sign Up Free
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
