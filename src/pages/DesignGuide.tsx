import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Layout, CheckCircle2, XCircle, Info, ArrowLeft, Loader2, Globe, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { getDesignSuggestions, extractJobFromUrl, type DesignSuggestions } from "../services/api";

export const DesignGuide = () => {
  const [jobRole, setJobRole] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [suggestions, setSuggestions] = useState<DesignSuggestions | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtractJob = async () => {
    if (!jobUrl) return;
    setIsExtracting(true);
    setError(null);
    try {
      const data = await extractJobFromUrl(jobUrl);
      setJobRole(data.title);
      setExtraInfo(data.description);
    } catch (err: any) {
      setError("Failed to extract job details from URL. Please enter them manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGetSuggestions = async () => {
    if (!jobRole) {
      setError("Please enter a job role first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDesignSuggestions(jobRole, extraInfo);
      setSuggestions(data);
      // Scroll to results
      setTimeout(() => {
        document.getElementById("suggestions-results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] pt-32 pb-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Analyzer</span>
        </Link>

        {/* Header */}
        <div className="mb-10 md:mb-16">
          <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 block">Strategy Module</span>
          <h1 className="text-3xl md:text-5xl font-serif italic tracking-tight mb-4 shine">Resume Strategy Builder</h1>
          <p className="text-white/40 max-w-2xl text-base md:text-lg">
            Tell us where you're applying, and our AI will architect the perfect resume structure, content, and vibe for that specific target.
          </p>
        </div>

        {/* Form */}
        <div className="glass p-6 md:p-12 rounded-[24px] md:rounded-[32px] mb-16 relative overflow-hidden group">
          <div className="glass-reflection" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                  <Globe size={12} />
                  Import from Job URL
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="https://linkedin.com/jobs/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-blue-500/50 transition-all font-light"
                  />
                  <button 
                    onClick={handleExtractJob}
                    disabled={isExtracting || !jobUrl}
                    className="bg-white/10 hover:bg-white/20 px-4 rounded-xl transition-all disabled:opacity-30 flex items-center justify-center min-w-[50px]"
                  >
                    {isExtracting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                  <Briefcase size={12} />
                  Target Role & Company
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Frontend Engineer at Google"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-blue-500/50 transition-all font-light"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                  <Info size={12} />
                  Additional Context (Optional)
                </label>
                <textarea 
                  placeholder="Paste job description or specify company culture goals..."
                  value={extraInfo}
                  onChange={(e) => setExtraInfo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:py-4 text-xs sm:text-sm focus:outline-none focus:border-blue-500/50 transition-all font-light min-h-[120px] md:min-h-[150px] resize-none"
                />
              </div>

              <button 
                onClick={handleGetSuggestions}
                disabled={isLoading || !jobRole}
                className="w-full py-4 md:py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl md:rounded-2xl font-mono font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 disabled:opacity-30 flex items-center justify-center gap-3 text-xs md:text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Calculating Strategy...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Strategy Guide
                  </>
                )}
              </button>

              {error && (
                <p className="text-red-400 text-xs font-mono text-center">{error}</p>
              )}
            </div>

            <div className="hidden md:flex flex-col justify-center items-center p-12 bg-white/[0.02] border border-white/5 rounded-[24px] text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                 <Layout size={32} />
              </div>
              <h3 className="font-bold text-xl">The "Pre-Flight" Check</h3>
              <p className="text-sm opacity-40 leading-relaxed max-w-xs">
                Don't waste time building the wrong resume. Use this tool to identify the exact technical and visual benchmarks for your target role.
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {suggestions && (
            <motion.div 
              id="suggestions-results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Strategy Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  <div className="glass p-6 md:p-10 rounded-[24px] md:rounded-[32px] space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Sparkles size={20} className="md:w-6 md:h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold">The Core Strategy</h2>
                    </div>
                    <p className="text-base md:text-lg font-light leading-relaxed opacity-80 italic">
                      "{suggestions.strategy}"
                    </p>
                  </div>

                  <div className="glass p-6 md:p-10 rounded-[24px] md:rounded-[32px] space-y-6 md:space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Layout size={18} className="md:w-5 md:h-5" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold">Layout & Architecture</h3>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed opacity-60 font-light">
                      {suggestions.layoutAdvice}
                    </p>
                  </div>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="glass p-6 md:p-8 rounded-[24px] md:rounded-[32px] space-y-4 md:space-y-6 border-blue-500/10">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                       Keywords Strategy
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.keywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] md:text-[10px] font-mono font-bold text-blue-400">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="glass p-6 md:p-10 rounded-[24px] md:rounded-[32px] border-green-500/10">
                  <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-green-500" />
                    Essential Do's
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {suggestions.dos.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start p-3 md:p-4 bg-green-500/5 rounded-xl md:rounded-2xl border border-green-500/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                        <p className="text-xs md:text-sm font-light opacity-80">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass p-6 md:p-10 rounded-[24px] md:rounded-[32px] border-red-500/10">
                  <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center gap-3">
                    <XCircle size={24} className="text-red-500" />
                    Critical Don'ts
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {suggestions.donts.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start p-3 md:p-4 bg-red-500/5 rounded-xl md:rounded-2xl border border-red-500/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                        <p className="text-xs md:text-sm font-light opacity-80">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Final Footer */}
              <div className="text-center py-12">
                <p className="opacity-40 text-sm italic">
                  Now you have the strategy. Use it to build your resume and come back to <Link to="/" className="text-primary hover:underline">analyze it</Link>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
