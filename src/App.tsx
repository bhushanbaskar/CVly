import React, { useState, useEffect, useRef } from "react";
import { 
  Upload, 
  FileText, 
  Search, 
  Sparkles, 
  Bot, 
  UserCircle, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Trophy,
  Link as LinkIcon,
  Globe,
  Layout
} from "lucide-react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import Lenis from "lenis";
import { ThemeProvider, useTheme } from "next-themes";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { extractTextFromPDF, pdfToImages } from "./lib/pdf";
import { fileToBase64 } from "./lib/file";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { analyzeFullResume, extractJobFromUrl, type AnalysisResponse, type PersonaResult, type AnalysisRequest } from "./services/api";
import { Navbar } from "./components/Navbar";
import { UploadZone } from "./components/UploadZone";
import { PersonaCard } from "./components/PersonaCard";
import { BulletRefinementSandbox } from "./components/BulletRefinementSandbox";
import { AnalysisSkeleton } from "./components/SkeletonLoader";
import { Footer } from "./components/Footer";
import { DesignGuide } from "./pages/DesignGuide";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
const TypedThemeProvider = ThemeProvider as any;

// --- Components ---

import { WaveBackground } from "./components/WaveBackground";

// --- Main Page ---

function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [activeResume, setActiveResume] = useState<File | null>(null);
  const [secondResume, setSecondResume] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [jobFetchError, setJobFetchError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewingResume, setViewingResume] = useState<"A" | "B">("A");
  
  // Sandbox states
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [sandboxBulletText, setSandboxBulletText] = useState("");

  const handleOpenSandbox = (bullet: string) => {
    setSandboxBulletText(bullet);
    setIsSandboxOpen(true);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial entrance animations
    const tl = gsap.timeline();
    tl.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
      stagger: 0.1
    })
    .from(".hero-desc", {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: "power3.out"
    }, "-=1.2")
    .from(".hero-btns", {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power2.out"
    }, "-=1")
    .from(".hero-visual", {
      opacity: 0,
      y: 100,
      scale: 0.9,
      duration: 1.5,
      ease: "power4.out"
    }, "-=1");

    // Scroll-triggered animations for content
    gsap.from(".scroll-reveal", {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".scroll-reveal-trigger",
        start: "top 80%",
      }
    });

    // Reveal the analyzer form with a scale effect
    gsap.from(".analyzer-card", {
      scale: 0.95,
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".analyzer-card",
        start: "top 75%",
      }
    });

    // 3D Tilt interaction for glass cards
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const mX = (clientX / window.innerWidth) * 100;
      const mY = (clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--mouse-x", `${mX}%`);
      document.documentElement.style.setProperty("--mouse-y", `${mY}%`);

      const angle = (Math.atan2(clientY - window.innerHeight / 2, clientX - window.innerWidth / 2) * 180) / Math.PI + 90;
      document.documentElement.style.setProperty("--gradient-angle", `${angle}deg`);
    };

    if (window.matchMedia("(hover: hover)").matches) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    
    // Refresh ScrollTrigger and GSAP on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, { scope: containerRef });

  const scrollToAnalyzer = () => {
    const element = document.getElementById("resume-analyzer");
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFetchJob = async () => {
    if (!jobUrl.trim()) return;
    setIsFetchingUrl(true);
    setJobFetchError(null);
    setError(null);
    try {
      const data = await extractJobFromUrl(jobUrl);
      setJobRole(data.title);
      setExtraInfo(data.extraInfo || "");
    } catch (err: any) {
      setJobFetchError("Failed to fetch job details. Check the URL or enter manually.");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleAnalyse = async () => {
    if (!activeResume) {
      setError("Please upload your resume (PDF or Image)");
      return;
    }
    if (!jobRole.trim()) {
      setError("Please enter the job role or fetch from URL");
      return;
    }

    const analyzerSection = document.getElementById("resume-analyzer");
    if (analyzerSection) {
      analyzerSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setError(null);
    setIsAnalysing(true);

    try {
      const processResume = async (file: File) => {
        let text = "";
        let files: { data: string, mimeType: string }[] = [];

        if (file.type === "application/pdf") {
          try {
            text = await extractTextFromPDF(file);
          } catch (e) {
            console.log("PDF text extraction failed", e);
          }
          
          // If text is very short/sparse, it's likely a scan.
          // Convert pages to images for superior OCR accuracy.
          if (text.trim().length < 200) {
            try {
              files = await pdfToImages(file);
            } catch (err) {
              // Fallback to sending the raw PDF if image conversion fails
              const base64 = await fileToBase64(file);
              files = [{ data: base64, mimeType: file.type }];
            }
          }
        } else if (file.type.startsWith("image/")) {
          const base64 = await fileToBase64(file);
          files = [{ data: base64, mimeType: file.type }];
        }

        return { text, files };
      };

      // 1. Process Resume A
      const { text: textA, files: filesA } = await processResume(activeResume);
      
      const requestA: AnalysisRequest = {
        resumeText: textA || undefined,
        resumeFiles: filesA.length > 0 ? filesA : undefined,
        jobRole,
        extraInfo
      };

      const resultsAFull = await analyzeFullResume(requestA);
      
      // 2. Process Resume B if exists
      let resultsBFull = null;
      if (secondResume) {
        const { text: textB, files: filesB } = await processResume(secondResume);
        const requestB: AnalysisRequest = {
          resumeText: textB || undefined,
          resumeFiles: filesB.length > 0 ? filesB : undefined,
          jobRole,
          extraInfo
        };
        resultsBFull = await analyzeFullResume(requestB);
      }

      setResults({
        resumeA: resultsAFull,
        resumeB: resultsBFull
      });
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const calculateAverage = (resumeResults: any) => {
    if (!resumeResults) return 0;
    const { ats, hr, manager } = resumeResults;
    return parseFloat(((ats.score + hr.score + manager.score) / 3).toFixed(1));
  };

  const getScoreColor = (score: number) => {
    if (score >= 7.5) return "bg-green-500";
    if (score >= 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const chartData = results ? [
    { name: "ATS Bot", a: results.resumeA.ats.score, b: results.resumeB?.ats.score || 0, color: "#3b82f6" },
    { name: "HR Recruiter", a: results.resumeA.hr.score, b: results.resumeB?.hr.score || 0, color: "#a855f7" },
    { name: "Hiring Manager", a: results.resumeA.manager.score, b: results.resumeB?.manager.score || 0, color: "#f97316" }
  ] : [];

  return (
    <div className="flex-grow">
      <AnimatePresence mode="wait">
        {isAnalysing ? (
          <main className="w-full max-w-5xl mx-auto px-6 py-32 md:py-40">
            <motion.div
              key="analysing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnalysisSkeleton />
            </motion.div>
          </main>
        ) : !results ? (
          <div ref={containerRef}>
            {/* SaaS Hero Section */}
            <section className="relative w-full pt-48 pb-32 overflow-hidden">
              {/* Centered Headlines */}
              <motion.div 
                style={{ y: y1, opacity }}
                className="relative max-w-5xl mx-auto px-6 text-center z-10 mb-24"
              >
                <h1 
                  className="hero-title text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif italic leading-[0.85] tracking-tight mb-6 md:mb-8 text-gradient shine"
                >
                  Analyze. <br />
                  Optimize. <span className="opacity-40 italic">Land.</span>
                </h1>
                <p 
                  className="hero-desc text-white/40 text-[13px] sm:text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-4 md:px-0"
                >
                  The world's first AI-powered resume analyzer that simulates the real-world hiring panel: ATS Bots, HR Recruiters, and Tech Managers.
                </p>
                
                <div 
                  className="hero-btns flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 md:px-0"
                >
                  <button 
                    onClick={scrollToAnalyzer}
                    className="flex-1 sm:flex-none min-w-[140px] sm:w-auto bg-white text-black px-4 py-3.5 sm:px-10 sm:py-5 rounded-xl sm:rounded-3xl font-bold text-xs sm:text-lg hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
                  >
                    Analyze My Resume
                  </button>
                  <Link 
                    to="/design-guide"
                    className="flex-1 sm:flex-none min-w-[140px] sm:w-auto bg-blue-600 text-white px-4 py-3.5 sm:px-10 sm:py-5 rounded-xl sm:rounded-3xl font-bold text-xs sm:text-lg hover:brightness-110 transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-center"
                  >
                    Design Guide
                  </Link>
                  <Link 
                    to="/about"
                    className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                  >
                    Learn the Methodology
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div 
                style={{ opacity }}
                className="absolute left-6 bottom-32 hidden lg:flex flex-col items-center gap-4"
              >
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] vertical-text">Scroll for more</span>
                <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
              </motion.div>

              {/* Product Visual Bottom */}
              <div className="hero-visual relative max-w-5xl mx-auto px-4 md:px-6 flex justify-center">
                <motion.div 
                  style={{ y: y2 }}
                  className="relative w-full aspect-[4/3] md:aspect-[16/9] max-w-4xl bg-white/[0.02] border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl glass"
                >
                  {/* Mock Analysis Interface */}
                  <div className="absolute inset-0 p-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                      <div className="flex gap-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                      </div>
                      <div className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-mono text-white/40 uppercase tracking-widest">Analysis Engine v2.4</div>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-8 flex-grow">
                      <div className="col-span-8 space-y-8">
                        <div className="space-y-4">
                          <div className="h-6 w-48 bg-white/10 rounded animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-3 w-content max-w-md bg-white/5 rounded" />
                            <div className="h-3 w-content max-w-sm bg-white/5 rounded" />
                            <div className="h-3 w-content max-w-lg bg-white/5 rounded" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-square bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-600/20" />
                              <div className="h-2 w-12 bg-white/10 rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-4 border-l border-white/5 pl-8 flex flex-col justify-center gap-12">
                        <div className="space-y-2">
                          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">Overall Score</div>
                          <div className="text-6xl font-serif text-white italic">8.9</div>
                        </div>
                        <div className="space-y-4">
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-[89%] bg-blue-600" />
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden opacity-50">
                            <div className="h-full w-[40%] bg-blue-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating SaaS Tags */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 -left-6 bg-white/[0.08] backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl z-20 pointer-events-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Validation</div>
                        <div className="text-xs font-semibold text-white">ATS Optimized</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 -right-6 bg-white/[0.08] backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl z-20 pointer-events-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Bot size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Analysis</div>
                        <div className="text-xs font-semibold text-white">AI Panel Ready</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Main Content Area */}
            <main id="resume-analyzer" className="scroll-reveal-trigger w-full max-w-5xl mx-auto px-6 py-24 scroll-mt-24">
              <div className="space-y-12">
                {/* Form Heading */}
                <div className="scroll-reveal text-center mb-8 md:mb-16">
                  <span className="text-[9px] md:text-[10px] font-mono font-bold text-blue-400 uppercase tracking-[0.2em] mb-2 md:mb-4 block">Deployment Center</span>
                  <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">Upload & Calibrate</h2>
                </div>

                {/* Form */}
                <div className="analyzer-card max-w-4xl mx-auto glass p-5 md:p-12 rounded-3xl md:rounded-[32px] group overflow-hidden relative z-10">
                  <div className="glass-reflection" />
                  <div className="relative z-10 space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <UploadZone 
                      label="Upload Resume" 
                      file={activeResume} 
                      onFileSelect={(f) => {
                        setActiveResume(f);
                        setError(null);
                      }} 
                    />
                    <UploadZone 
                      label="Compare Resume" 
                      file={secondResume} 
                      isSecondary
                      onFileSelect={(f) => setSecondResume(f)} 
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium opacity-70 ml-1">Import Job Details from URL (Optional)</label>
                        <div className="flex gap-2">
                          <div className="relative flex-grow">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                            <input 
                              type="url" 
                              placeholder="Paste job page URL"
                              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-10 py-2.5 sm:px-11 sm:py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-xs sm:text-sm"
                              value={jobUrl}
                              onChange={(e) => setJobUrl(e.target.value)}
                            />
                          </div>
                          <button 
                            onClick={handleFetchJob}
                            disabled={!jobUrl.trim() || isFetchingUrl}
                            className="px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-md)] font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary/10 hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
                          >
                            {isFetchingUrl ? <RefreshCw className="animate-spin" size={14} /> : <LinkIcon size={14} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium opacity-70 ml-1">Job Role & Company (Target)</label>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                          <input 
                            type="text" 
                            placeholder="e.g. Senior Frontend Developer"
                            className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-10 py-2.5 sm:px-11 sm:py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-xs sm:text-sm"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium opacity-70 ml-1">Extra Context / Key Requirements (Optional)</label>
                      <textarea 
                        placeholder="e.g. Must have strong Experience in React, Node.js and AWS. Focus on my leadership roles."
                        className="w-full bg-[var(--card-bg)] border border-white/5 rounded-[var(--radius-md)] px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-xs sm:text-sm min-h-[80px] resize-none overflow-hidden"
                        value={extraInfo}
                        onChange={(e) => setExtraInfo(e.target.value)}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = "auto";
                          target.style.height = `${target.scrollHeight}px`;
                        }}
                      />
                    </div>

                  <div className="space-y-4">
                    <button 
                      onClick={handleAnalyse}
                      disabled={!activeResume || !jobRole || isAnalysing}
                      className={cn(
                        "w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl font-mono font-bold text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-xs md:text-sm",
                        (!activeResume || !jobRole || isAnalysing) 
                          ? "bg-white/10 cursor-not-allowed opacity-30 px-2" 
                          : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 cursor-pointer"
                      )}
                    >
                      {isAnalysing ? (
                        <>
                          <RefreshCw className="animate-spin" size={20} />
                          <span>Analysing...</span>
                        </>
                      ) : (
                        <>
                          <span>Deploy Analysis</span>
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-[var(--radius-md)] bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3"
                      >
                        <AlertCircle size={20} className="shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                      </motion.div>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        ) : (
          <main className="w-full max-w-5xl mx-auto px-6 py-32 md:py-40">
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Result Header */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 pb-8 border-b border-[var(--card-border)]">
                <div className="space-y-4 text-center md:text-left w-full md:w-auto">
                  <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-bold">Analysis Results</h2>
                    <p className="opacity-60 flex items-center gap-2 justify-center md:justify-start text-sm">
                      <Briefcase size={16} />
                      {jobRole}
                    </p>
                  </div>
                  
                  {results.resumeB && (
                    <div className="flex bg-[var(--card-bg)] p-1 rounded-lg border border-[var(--card-border)] w-fit mx-auto md:mx-0">
                      <button 
                        onClick={() => setViewingResume("A")}
                        className={cn(
                          "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                          viewingResume === "A" ? "bg-primary text-white shadow-md" : "opacity-50 hover:opacity-100"
                        )}
                      >
                        Resume A
                      </button>
                      <button 
                        onClick={() => setViewingResume("B")}
                        className={cn(
                          "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                          viewingResume === "B" ? "bg-primary text-white shadow-md" : "opacity-50 hover:opacity-100"
                        )}
                      >
                        Resume B
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-6 md:gap-8 w-full md:w-auto justify-center md:justify-end">
                  <div className="flex flex-col items-center md:items-end gap-1 md:gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl md:text-6xl font-pixel">{calculateAverage(results.resumeA)}</span>
                      <span className="opacity-40 font-mono text-[10px] md:text-xs">/ 10</span>
                    </div>
                    <div className="w-32 md:w-40 h-1.5 md:h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${calculateAverage(results.resumeA) * 10}%` }}
                        className={cn("h-full", getScoreColor(calculateAverage(results.resumeA)))}
                      />
                    </div>
                    <p className="text-[9px] md:text-[10px] font-mono uppercase font-bold tracking-widest opacity-40">
                      {results.resumeB ? "Resume A Avg" : "Overall Average"}
                    </p>
                  </div>

                  {results.resumeB && (
                    <div className="flex flex-col items-center md:items-end gap-1 md:gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl md:text-6xl font-pixel">{calculateAverage(results.resumeB)}</span>
                        <span className="opacity-40 font-mono text-[10px] md:text-xs">/ 10</span>
                      </div>
                      <div className="w-32 md:w-40 h-1.5 md:h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${calculateAverage(results.resumeB) * 10}%` }}
                          className={cn("h-full", getScoreColor(calculateAverage(results.resumeB)))}
                        />
                      </div>
                      <p className="text-[9px] md:text-[10px] font-mono uppercase font-bold tracking-widest opacity-40">Resume B Avg</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Persona Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* @ts-ignore */}
                <PersonaCard 
                  icon={Bot} 
                  name="ATS Bot" 
                  title="Strict Algorithm" 
                  data={viewingResume === "A" ? results.resumeA.ats : results.resumeB!.ats} 
                  color="bg-blue-500" 
                />
                {/* @ts-ignore */}
                <PersonaCard 
                  icon={UserCircle} 
                  name="HR Recruiter" 
                  title="6-Second Skim" 
                  data={viewingResume === "A" ? results.resumeA.hr : results.resumeB!.hr} 
                  color="bg-purple-500" 
                />
                {/* @ts-ignore */}
                <PersonaCard 
                  icon={Briefcase} 
                  name="Hiring Manager" 
                  title="Technical Quality" 
                  data={viewingResume === "A" ? results.resumeA.manager : results.resumeB!.manager} 
                  color="bg-orange-500" 
                  onRefineImprove={handleOpenSandbox}
                />
              </div>

              {/* Chart Section */}
              <div className="glass rounded-2xl md:rounded-[32px] p-6 md:p-12">
                <h3 className="font-bold text-base md:text-lg mb-6 md:mb-8 text-center flex items-center justify-center gap-2">
                  <Trophy size={18} className="text-yellow-500" />
                  Persona Score Breakdown
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--text-color)', opacity: 0.5, fontSize: 12 }} 
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--text-color)', opacity: 0.5, fontSize: 12 }} 
                      />
                      <RechartsTooltip 
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-2 rounded-lg shadow-xl text-xs font-bold">
                                {payload[0].value} / 10
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="a" name="Resume A" radius={[6, 6, 0, 0]} barSize={30}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                        ))}
                      </Bar>
                      {results.resumeB && (
                        <Bar dataKey="b" name="Resume B" radius={[6, 6, 0, 0]} barSize={30}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-b-${index}`} fill={entry.color} fillOpacity={0.4} />
                          ))}
                        </Bar>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comparison Section (Optional) */}
              {results.resumeB && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full text-xs font-bold uppercase tracking-widest">
                      Comparison Mode
                    </div>
                    <h3 className="text-2xl font-bold">
                      {calculateAverage(results.resumeA) >= calculateAverage(results.resumeB) 
                        ? `Resume A is stronger for ${jobRole}` 
                        : `Resume B is stronger for ${jobRole}`}
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-xl)] overflow-hidden">
                      <thead>
                        <tr className="bg-[var(--card-border)]/20">
                          <th className="p-4 font-bold opacity-60">Persona</th>
                          <th className="p-4 font-bold text-center">Resume A</th>
                          <th className="p-4 font-bold text-center">Resume B</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--card-border)]">
                        <tr>
                          <td className="p-4 font-medium">ATS Score</td>
                          <td className={cn("p-4 text-center text-lg font-bold", results.resumeA.ats.score >= results.resumeB.ats.score && "text-green-500")}>
                            {results.resumeA.ats.score}
                          </td>
                          <td className={cn("p-4 text-center text-lg font-bold", results.resumeB.ats.score > results.resumeA.ats.score && "text-green-500")}>
                            {results.resumeB.ats.score}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 font-medium">HR Score</td>
                          <td className={cn("p-4 text-center text-lg font-bold", results.resumeA.hr.score >= results.resumeB.hr.score && "text-green-500")}>
                            {results.resumeA.hr.score}
                          </td>
                          <td className={cn("p-4 text-center text-lg font-bold", results.resumeB.hr.score > results.resumeA.hr.score && "text-green-500")}>
                            {results.resumeB.hr.score}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 font-medium">Manager Score</td>
                          <td className={cn("p-4 text-center text-lg font-bold", results.resumeA.manager.score >= results.resumeB.manager.score && "text-green-500")}>
                            {results.resumeA.manager.score}
                          </td>
                          <td className={cn("p-4 text-center text-lg font-bold", results.resumeB.manager.score > results.resumeA.manager.score && "text-green-500")}>
                            {results.resumeB.manager.score}
                          </td>
                        </tr>
                        <tr className="bg-primary/5">
                          <td className="p-4 font-bold">AVERAGE</td>
                          <td className={cn("p-4 text-center text-2xl font-black", calculateAverage(results.resumeA) >= calculateAverage(results.resumeB) && "text-green-500")}>
                            {calculateAverage(results.resumeA)}
                          </td>
                          <td className={cn("p-4 text-center text-2xl font-black", calculateAverage(results.resumeB) > calculateAverage(results.resumeA) && "text-green-500")}>
                            {calculateAverage(results.resumeB)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Template Suggestions */}
              <div className="glass rounded-2xl md:rounded-[32px] p-6 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div className="space-y-2">
                       <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.2em] block">Strategy Session</span>
                       <h3 className="font-bold text-2xl md:text-3xl flex items-center gap-3">
                        <Layout size={24} className="text-primary" />
                        Strategic Layouts
                      </h3>
                    </div>
                    <p className="text-sm opacity-50 max-w-sm md:text-right">
                      Switching to these templates can help bypass specific "Red Flags" identified by our hiring panel.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(viewingResume === "A" ? results.resumeA.templateSuggestions : results.resumeB?.templateSuggestions)?.map((template, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-primary/50 transition-all flex flex-col gap-4 group cursor-default"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Sparkles size={20} />
                          </div>
                          <span className="text-[10px] font-mono font-black uppercase tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity">REC. 0{idx + 1}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold mb-3">{template.name}</h4>
                          <p className="text-sm opacity-60 leading-relaxed font-light line-clamp-4 group-hover:line-clamp-none transition-all">{template.reason}</p>
                        </div>
                        <div className="mt-auto pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Optimized for {jobRole}</span>
                        </div>
                      </motion.div>
                    )) || (
                      <div className="col-span-full py-12 text-center opacity-40 italic">
                        No template suggestions available for this analysis.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reset */}
              <div className="pt-12 text-center">
                <button 
                  onClick={() => {
                    setResults(null); 
                    setActiveResume(null);
                    setSecondResume(null);
                    setJobRole("");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] border border-[var(--card-border)] hover:bg-[var(--card-border)] transition-colors font-bold opacity-60 hover:opacity-100"
                >
                  <ArrowLeft size={18} />
                  Analyse Another Resume
                </button>
              </div>
            </motion.div>
          </main>
        )}
      </AnimatePresence>

      <BulletRefinementSandbox
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
        bulletText={sandboxBulletText}
        jobRole={jobRole}
      />
    </div>
  );
}

// --- About Page ---

function About() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto space-y-24">
        {/* Hero Section */}
        <div className="space-y-6">
          <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-[0.2em] block">The Methodology</span>
          <h1 className="text-4xl md:text-7xl font-serif italic tracking-tight leading-[0.9] shine">Simulating the <br/> hiring chamber.</h1>
          <p className="text-lg md:text-2xl text-white/40 max-w-2xl font-light leading-relaxed">
            CVly doesn't just check keywords. It reconstructs the real-world friction of a hiring process using three distinct AI personas.
          </p>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "The ATS Bot",
              desc: "Simulates the algorithmic filter. It looks for machine-readable headers, standard fonts, and keyword density. If it can't parse you, the others never see you.",
              icon: <Bot className="text-blue-500" size={24} />
            },
            {
              title: "The HR Specialist",
              desc: "Evaluates branding, visual hierarchy, and the 6-second scan. It looks for career trajectory and immediate impact through whitespace and layout.",
              icon: <UserCircle className="text-purple-500" size={24} />
            },
            {
              title: "The Technical Lead",
              desc: "Deep dives into your tech stack and business outcomes. It looks for senior-level contributions and quantifiable achievements, ignoring the fluff.",
              icon: <Briefcase className="text-orange-500" size={24} />
            }
          ].map((persona, i) => (
            <div key={i} className="glass p-8 rounded-[32px] space-y-4 border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                {persona.icon}
              </div>
              <h3 className="text-xl font-bold">{persona.title}</h3>
              <p className="text-sm opacity-50 font-light leading-relaxed">{persona.desc}</p>
            </div>
          ))}
        </div>

        {/* Academic Context */}
        <div className="glass p-8 md:p-12 rounded-[40px] border-white/5 space-y-8">
           <h2 className="text-sm font-mono font-bold uppercase tracking-widest opacity-30">Academic Foundation</h2>
           <p className="text-lg md:text-xl leading-relaxed font-light opacity-80">
            CVly was built as part of the Engineering Exploration subject at K. K. Wagh Institute of Engineering Education and Research, Nashik. 
            We are students of the Computer Science and Design Engineering branch, exploring the intersection of AI and Career Intelligence.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {["Bhushan Baskar", "Abhilash Chandwadkar", "Omkar Chavhan", "Disha Auti", "Aaditya Pardeshi"].map(name => (
              <div key={name} className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] font-bold opacity-60">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="glass p-12 rounded-[40px] text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10 blur-[120px] pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to outsmart the bots?</h2>
            <div className="flex justify-center">
              <Link to="/" className="bg-white text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-2xl">
                Get Analyzed Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- App Entry Point ---

export default function App() {
  useEffect(() => {
    const lenis = new Lenis();
    (window as any).lenis = lenis;
    function raf(time: number) {
      if ((window as any).lenis) {
        lenis.raf(time);
      }
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return (
    <TypedThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-transparent text-[var(--text-color)] relative">
          <WaveBackground />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/design-guide" element={<DesignGuide />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </TypedThemeProvider>
  );
}
