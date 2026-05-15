import React from "react";
import { motion } from "motion/react";
import { Mail, Github, Twitter, Linkedin, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-[var(--bg-color)] pt-16 md:pt-24 pb-12">
      {/* Top Gradient Blend */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-transparent z-10 pointer-events-none" />

      {/* Light Blue Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div 
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[120%] blur-[120px]"
          style={{
            background: "radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 70%)"
          }}
        />
        <div 
          className="absolute top-[10%] -right-[5%] w-[60%] h-[100%] blur-[100px]"
          style={{
            background: "radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 70%)"
          }}
        />
        <div 
          className="absolute -bottom-[20%] left-[20%] w-[50%] h-[80%] blur-[90px]"
          style={{
            background: "radial-gradient(circle at 50% 50%, #60a5fa 0%, transparent 70%)"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          {/* Main Call to Action */}
          <div className="md:col-span-6 lg:col-span-7">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-[0.9] tracking-tight mb-8">
              Let's craft your <br />
              <span className="italic font-light opacity-60 text-blue-400">career story.</span>
            </h2>
            <p className="text-white/40 text-lg max-w-md mb-10 leading-relaxed">
              Better resumes lead to better opportunities. Stay updated with our latest career-building features and insights.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-medium transition-all flex items-center gap-3 group"
            >
              Join the waitlist
              <Mail className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-3 lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.2em]">Product</h4>
            <ul className="space-y-4">
              {["Resume Parser", "Persona Analysis", "Job Extractor", "Compare Mode"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group">
                    {item}
                    <div className="flex-grow border-b border-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-3 space-y-6">
            <h4 className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.2em]">Connect</h4>
            <div className="grid grid-cols-1 gap-4">
              <a href="#" className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-blue-400 transition-colors">
                  <Github className="w-4 h-4" />
                </div>
                <span className="text-sm text-white/60 group-hover:text-white">GitHub Repository</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-20 group-hover:opacity-50" />
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-blue-400 transition-colors">
                  <Twitter className="w-4 h-4" />
                </div>
                <span className="text-sm text-white/60 group-hover:text-white">@careerai_build</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Meta Row */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-8 text-[11px] font-mono uppercase tracking-widest text-white/20">
          <div className="space-y-1">
            <p className="text-white/40">© 2026 CVly</p>
            <p>Built with ❤️ for Job Seekers</p>
          </div>
          
          <div className="flex gap-12">
            <div className="space-y-1">
              <p className="text-white/40">Fonts Used</p>
              <p>Inter, JetBrains Mono, Instrument Serif</p>
            </div>
            <div className="space-y-1 hidden lg:block">
              <p className="text-white/40">Environment</p>
              <p>Production Stage v2.4</p>
            </div>
            <div className="space-y-1">
              <p className="text-white/40">Legal</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
