import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Copy, Check, Sparkles } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type PersonaResult } from "../services/api";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PersonaCardProps {
  icon: any;
  name: string;
  title: string;
  data: PersonaResult;
  color: string;
  onRefineImprove?: (bullet: string) => void;
}

export const PersonaCard = ({ 
  icon: Icon, 
  name, 
  title, 
  data, 
  color,
  onRefineImprove
}: PersonaCardProps) => {
  const [copiedSection, setCopiedSection] = useState<"liked" | "improve" | null>(null);
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (data.score / 10) * circumference;

  const copyToClipboard = (textList: string[], section: "liked" | "improve") => {
    const text = textList.map(t => `• ${t}`).join("\n");
    const fullText = `${name} Analysis - ${section === "liked" ? "What worked" : "What to fix"}:\n${text}`;
    navigator.clipboard.writeText(fullText);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl md:rounded-[32px] p-5 md:p-6 transition-all card-hover group"
    >
      <div className="glass-reflection" />
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className={cn("p-2.5 md:p-3 rounded-xl md:rounded-2xl text-white transition-transform group-hover:scale-110", color)}>
            <Icon size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base md:text-lg tracking-tight shine">{name}</h3>
            <p className="text-[9px] md:text-[10px] font-mono opacity-50 uppercase tracking-tighter">{title}</p>
          </div>
        </div>
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[var(--card-border)]" />
            <circle 
              cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" 
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={cn(data.score > 7 ? "text-green-500" : data.score > 4 ? "text-yellow-500" : "text-red-500")}
            />
          </svg>
          <span className="absolute text-sm font-mono font-bold">{data.score}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-mono font-bold text-green-500 uppercase tracking-widest">What worked</h4>
            <button 
              onClick={() => copyToClipboard(data.liked, "liked")}
              className="p-1.5 rounded-md hover:bg-green-500/10 text-green-500/40 hover:text-green-500 transition-all opacity-0 group-hover:opacity-100"
              title="Copy details"
            >
              <AnimatePresence mode="wait">
                {copiedSection === "liked" ? (
                  <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <Check size={14} />
                  </motion.div>
                ) : (
                  <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <Copy size={14} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
          <ul className="space-y-2">
            {data.liked.map((point, idx) => (
              <li key={idx} className="flex gap-2 text-sm items-start leading-snug">
                <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={14} />
                <span className="opacity-80">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest">What to fix</h4>
            <button 
              onClick={() => copyToClipboard(data.improve, "improve")}
              className="p-1.5 rounded-md hover:bg-orange-500/10 text-orange-500/40 hover:text-orange-500 transition-all opacity-0 group-hover:opacity-100"
              title="Copy details"
            >
              <AnimatePresence mode="wait">
                {copiedSection === "improve" ? (
                  <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <Check size={14} />
                  </motion.div>
                ) : (
                  <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <Copy size={14} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
          <ul className="space-y-2">
            {data.improve.map((point, idx) => (
              <li key={idx} className="flex flex-col gap-1.5 text-sm items-start leading-snug">
                <div className="flex gap-2 items-start leading-snug">
                  <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={14} />
                  <span className="opacity-80">{point}</span>
                </div>
                {onRefineImprove && name === "Hiring Manager" && (
                  <button
                    onClick={() => onRefineImprove(point)}
                    aria-label={`Refine bullet point: "${point}"`}
                    className="mt-1 ml-6 px-2.5 py-1 text-[10px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-1 focus:ring-offset-neutral-900 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={11} className="text-amber-400" />
                    Refine Bullet
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
