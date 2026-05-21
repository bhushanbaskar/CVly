import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Copy, Check, Loader2, ArrowRight, RefreshCw } from "lucide-react";
import { refineBulletPoint, type RefinedBulletResponse } from "../services/api";

interface BulletRefinementSandboxProps {
  isOpen: boolean;
  onClose: () => void;
  bulletText: string;
  jobRole: string;
}

export const BulletRefinementSandbox = ({
  isOpen,
  onClose,
  bulletText,
  jobRole,
}: BulletRefinementSandboxProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RefinedBulletResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"resultDriven" | "semanticKeyword" | "narrativeImpact">("resultDriven");
  
  // Client-side local cache map to completely avoid repeating expensive API requests
  const [cache, setCache] = useState<Record<string, RefinedBulletResponse>>({});

  // Playground state
  const [playgroundText, setPlaygroundText] = useState("");
  const [copiedText, setCopiedText] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Pause global Lenis smooth scrolling to completely freeze background scrolling
      if ((window as any).lenis) {
        (window as any).lenis.stop();
      }

      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyHeight = document.body.style.height;
      const originalHtmlHeight = document.documentElement.style.height;

      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100%";

      return () => {
        // Resume global Lenis smooth scrolling when closing
        if ((window as any).lenis) {
          (window as any).lenis.start();
        }

        document.body.style.overflow = originalBodyOverflow;
        document.body.style.height = originalBodyHeight;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.height = originalHtmlHeight;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && bulletText) {
      fetchRefinement();
    }
  }, [isOpen, bulletText]);

  const fetchRefinement = async () => {
    if (!bulletText) return;

    // Instantly restore from client-side cache to save time and AI credits
    if (cache[bulletText]) {
      setData(cache[bulletText]);
      setPlaygroundText(cache[bulletText].variations.resultDriven);
      setActiveTab("resultDriven");
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await refineBulletPoint(bulletText, jobRole);
      // Store in client-side cache
      setCache(prev => ({ ...prev, [bulletText]: result }));
      setData(result);
      setPlaygroundText(result.variations.resultDriven);
      setActiveTab("resultDriven");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to decompose and refine bullet point.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSelectVariation = (text: string, type: "resultDriven" | "semanticKeyword" | "narrativeImpact") => {
    setActiveTab(type);
    setPlaygroundText(text);
  };

  const copyPlayground = () => {
    navigator.clipboard.writeText(playgroundText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div data-lenis-prevent="true" className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window - Compact and smaller for mobile viewports */}
        <motion.div
          data-lenis-prevent="true"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl max-h-[94vh] md:max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-3xl text-white flex flex-col mx-auto"
        >
          {/* Header - Repositioned cross sign close button to top left */}
          <div className="px-4 py-3 md:px-8 md:py-5 bg-neutral-950/50 border-b border-neutral-800 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close Refinement Sandbox"
                className="relative z-[60] p-1 px-1.5 md:p-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/50 text-neutral-400 hover:text-white rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 flex items-center justify-center shrink-0"
              >
                <X size={16} className="md:w-5 md:h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <div className="p-1.5 md:p-2 bg-amber-500/10 text-amber-400 rounded-lg md:rounded-xl shrink-0">
                  <Sparkles size={14} className="md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm md:text-base tracking-tight">Interactive Refinement Sandbox</h3>
                  <p className="text-[9px] md:text-xs text-neutral-400 mt-0.5">Google's standard XYZ Formula builder</p>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:block text-[10px] font-mono text-amber-400/80 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 shrink-0">
              XYZ Core Engine
            </div>
          </div>

          {/* Content Area - scrollbar-none to hide browser scrollbars, fully scrollable via mouse ring */}
          <div id="sandbox-scroll-content" className="flex-1 overflow-y-auto scrollbar-none px-4 py-4 md:px-8 md:py-6 space-y-4 md:space-y-6">
            {/* Original bullet review */}
            <div className="bg-neutral-950/20 border border-neutral-800/60 rounded-xl md:rounded-2xl p-3 md:p-4">
              <h4 className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1">Selected Weak Bullet</h4>
              <p className="text-xs md:text-sm opacity-90 italic">"{bulletText}"</p>
            </div>

            {loading && (
              <div className="py-12 md:py-20 flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="text-amber-400"
                >
                  <Loader2 size={32} className="md:w-10 md:h-10" />
                </motion.div>
                <div className="text-center">
                  <p className="font-semibold text-xs md:text-sm text-neutral-200">Deconstructing and Rewriting...</p>
                  <p className="text-[10px] md:text-xs text-neutral-500 mt-1">Simulating ATS, HR, and Technical Manager perspectives...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="py-10 text-center text-red-400 space-y-4">
                <p className="text-xs md:text-sm">{error}</p>
                <button
                  onClick={fetchRefinement}
                  className="px-3 py-1.5 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-all cursor-pointer inline-flex items-center gap-2 text-xs"
                >
                  <RefreshCw size={12} />
                  Retry Refinement
                </button>
              </div>
            )}

            {!loading && !error && data && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 pb-2">
                {/* Left Column: XYZ Breakdown */}
                <div className="md:col-span-5 space-y-3 md:space-y-4">
                  <h4 className="text-xs md:text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <span>Google XYZ Formula</span>
                    <span className="text-[8px] font-mono font-normal opacity-50 px-1 py-0.5 bg-white/5 rounded">Standard</span>
                  </h4>

                  <div className="space-y-2 md:space-y-3">
                    {/* X component */}
                    <div className="p-3 bg-neutral-950/40 border-l-[3px] border-emerald-500 rounded-r-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Accomplished [X]</span>
                        <span className="text-[8px] text-neutral-500">Result/Scope</span>
                      </div>
                      <p className="text-[11px] md:text-xs text-neutral-300 leading-relaxed">{data.xyzDecomposition.x}</p>
                    </div>

                    {/* Y component */}
                    <div className="p-3 bg-neutral-950/40 border-l-[3px] border-blue-500 rounded-r-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest">Measured [Y]</span>
                        <span className="text-[8px] text-neutral-500">Metric Suggestion</span>
                      </div>
                      <p className="text-[11px] md:text-xs text-neutral-300 leading-relaxed">{data.xyzDecomposition.y}</p>
                    </div>

                    {/* Z component */}
                    <div className="p-3 bg-neutral-950/40 border-l-[3px] border-purple-500 rounded-r-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest">By doing [Z]</span>
                        <span className="text-[8px] text-neutral-500">Actions/Tools</span>
                      </div>
                      <p className="text-[11px] md:text-xs text-neutral-300 leading-relaxed">{data.xyzDecomposition.z}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Tones & Playground */}
                <div className="md:col-span-7 flex flex-col space-y-3 md:space-y-4">
                  <h4 className="text-xs md:text-sm font-bold text-neutral-300">Select Tone Target</h4>

                  {/* Variation Selector Cards */}
                  <div className="grid grid-cols-1 gap-2.5 md:gap-3">
                    {/* Result-Driven Card */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectVariation(data.variations.resultDriven, "resultDriven")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectVariation(data.variations.resultDriven, "resultDriven");
                        }
                      }}
                      className={`p-3 md:p-4 rounded-xl border text-left transition-all relative cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50 ${
                        activeTab === "resultDriven" 
                          ? "bg-amber-500/5 border-amber-500/40 shadow-inner" 
                          : "bg-neutral-950/30 border-neutral-800/80 hover:bg-neutral-800/30"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] md:text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                          <span>📈 Result-Driven Tone</span>
                          <span className="text-[7px] md:text-[8px] tracking-normal font-sans uppercase opacity-60 font-semibold px-1 bg-amber-500/20 text-amber-300 rounded">Expert Focus</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(data.variations.resultDriven, "resultDriven");
                          }}
                          className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-all z-10 cursor-pointer"
                          title="Copy instantly"
                          aria-label="Copy Result-Driven Tone Variation"
                        >
                          {copiedKey === "resultDriven" ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                        </button>
                      </div>
                      <p className="text-[11px] md:text-xs opacity-80 leading-relaxed font-sans">{data.variations.resultDriven}</p>
                    </div>

                    {/* Semantic Keyword Card */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectVariation(data.variations.semanticKeyword, "semanticKeyword")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectVariation(data.variations.semanticKeyword, "semanticKeyword");
                        }
                      }}
                      className={`p-3 md:p-4 rounded-xl border text-left transition-all relative cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${
                        activeTab === "semanticKeyword" 
                          ? "bg-blue-500/5 border-blue-500/40 shadow-inner" 
                          : "bg-neutral-950/30 border-neutral-800/80 hover:bg-neutral-800/30"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] md:text-xs font-mono font-bold text-blue-400 flex items-center gap-1.5">
                          <span>⚙️ Semantic-Keyword Tone</span>
                          <span className="text-[7px] md:text-[8px] tracking-normal font-sans uppercase opacity-60 font-semibold px-1 bg-blue-500/20 text-blue-300 rounded">ATS Bot</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(data.variations.semanticKeyword, "semanticKeyword");
                          }}
                          className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-all z-10 cursor-pointer"
                          title="Copy instantly"
                          aria-label="Copy Semantic-Keyword Tone Variation"
                        >
                          {copiedKey === "semanticKeyword" ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                        </button>
                      </div>
                      <p className="text-[11px] md:text-xs opacity-80 leading-relaxed font-sans">{data.variations.semanticKeyword}</p>
                    </div>

                    {/* Narrative Impact Card */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectVariation(data.variations.narrativeImpact, "narrativeImpact")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectVariation(data.variations.narrativeImpact, "narrativeImpact");
                        }
                      }}
                      className={`p-3 md:p-4 rounded-xl border text-left transition-all relative cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500/50 ${
                        activeTab === "narrativeImpact" 
                          ? "bg-purple-500/5 border-purple-500/40 shadow-inner" 
                          : "bg-neutral-950/30 border-neutral-800/80 hover:bg-neutral-800/30"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] md:text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
                          <span>🤝 Narrative-Impact Tone</span>
                          <span className="text-[7px] md:text-[8px] tracking-normal font-sans uppercase opacity-60 font-semibold px-1 bg-purple-500/20 text-purple-300 rounded">HR Recruiter</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(data.variations.narrativeImpact, "narrativeImpact");
                          }}
                          className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-all z-10 cursor-pointer"
                          title="Copy instantly"
                          aria-label="Copy Narrative-Impact Tone Variation"
                        >
                          {copiedKey === "narrativeImpact" ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                        </button>
                      </div>
                      <p className="text-[11px] md:text-xs opacity-80 leading-relaxed font-sans">{data.variations.narrativeImpact}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Playground Sandbox Footer - Compact height & size for mobile */}
          {!loading && !error && data && (
            <div className="p-4 md:p-6 bg-neutral-955 border-t border-neutral-850 shrink-0 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                <span className="text-[11px] md:text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse shrink-0" />
                  <span>Sandbox Playground: Tweak or perfect your chosen bullet</span>
                </span>
                <span className="text-[8px] md:text-[9px] font-mono text-neutral-500">Active base: {activeTab === "resultDriven" ? "Result-driven" : activeTab === "semanticKeyword" ? "Semantic ATS" : "Narrative HR"}</span>
              </div>

              <div className="relative">
                <textarea
                  value={playgroundText}
                  onChange={(e) => setPlaygroundText(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 md:p-3 text-[11.5px] md:text-sm text-white focus:outline-none focus:border-amber-500/50 min-h-[60px] pr-20 leading-relaxed h-[70px] md:h-[80px] resize-none scrollbar-none"
                  placeholder="Perfect your bullet here..."
                />
                <button
                  type="button"
                  onClick={copyPlayground}
                  className={`absolute right-2 bottom-3 px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-lg font-bold text-[9px] md:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    copiedText 
                      ? "bg-green-600 text-white" 
                      : "bg-white text-black hover:bg-neutral-200"
                  }`}
                >
                  {copiedText ? (
                    <>
                      <Check size={11} className="md:w-3.5 md:h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={11} className="md:w-3.5 md:h-3.5" />
                      Copy Bullet
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

