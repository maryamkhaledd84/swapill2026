import React from "react";
import { motion } from "motion/react";
import { Star, Zap, Code, Music, PenTool, Languages, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Skill, USERS } from "../../data/mockData";
import { cn } from "../../lib/utils";

interface SkillCardProps {
  skill: Skill;
  key?: React.Key;
}

// Category icon mapping
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Tech':
      return Code;
    case 'Music':
      return Music;
    case 'Writing':
      return PenTool;
    case 'Languages':
      return Languages;
    case 'Marketing':
      return TrendingUp;
    case 'Soft Skills':
      return Users;
    default:
      return Code;
  }
};

// Category color mapping for lavender theme
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Tech':
      return 'from-blue-500 to-purple-500';
    case 'Music':
      return 'from-purple-500 to-pink-500';
    case 'Writing':
      return 'from-pink-500 to-rose-500';
    case 'Languages':
      return 'from-rose-500 to-orange-500';
    case 'Marketing':
      return 'from-orange-500 to-yellow-500';
    case 'Soft Skills':
      return 'from-yellow-500 to-green-500';
    default:
      return 'from-purple-500 to-blue-500';
  }
};

export default function SkillCard({ skill }: SkillCardProps) {
  const user = USERS.find(u => u.id === skill.userId);
  const CategoryIcon = getCategoryIcon(skill.category);
  const colorClass = getCategoryColor(skill.category);

  if (!user) return null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900 border border-lavender-500/20 rounded-2xl p-6 h-full flex flex-col hover:border-lavender-500/40 hover:shadow-lg hover:shadow-lavender-500/10 transition-all duration-300"
    >
      {/* Category Icon */}
      <div className="flex items-center justify-between mb-6">
        <div className={cn(
          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
          colorClass
        )}>
          <CategoryIcon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-1 text-yellow-500 font-semibold text-sm">
          <Star className="w-4 h-4 fill-current" />
          {user.rating}
        </div>
      </div>

      {/* Skill Title */}
      <h3 className="text-xl font-bold text-white mb-3 leading-tight">
        {skill.title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">
        {skill.description}
      </p>

      {/* Expert Name and Quick Action */}
      <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-800">
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-white mb-1">{user.name}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">{skill.level}</div>
        </div>
        
        <Link 
          to="/chat" 
          className="p-3 rounded-xl bg-gradient-to-r from-lavender-500/20 to-purple-500/20 border border-lavender-500/30 hover:from-lavender-500/30 hover:to-purple-500/30 hover:border-lavender-500/50 transition-all duration-300 hover:scale-105"
        >
          <Zap className="w-4 h-4 text-lavender-400" />
        </Link>
      </div>
    </motion.div>
  );
}
