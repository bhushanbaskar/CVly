import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, X, FileText } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadZoneProps {
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  isSecondary?: boolean;
}

export const UploadZone = ({ 
  label, 
  file, 
  onFileSelect, 
  isSecondary = false 
}: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSelect(droppedFile);
    }
  };

  const validateAndSelect = (file: File) => {
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF and image files (PNG, JPG) are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className={cn("w-full h-full flex flex-col", isSecondary && "opacity-90")}>
      <div className={cn(
        "glass group relative overflow-hidden shadow-2xl flex flex-col transition-all",
        "p-4 md:p-6 rounded-2xl md:rounded-[32px] gap-3 md:gap-4"
      )}>
        <div className="glass-reflection" />
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-bold text-base shine">{label}</h3>
          </div>
          {file && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Drop Zone Area */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative group cursor-pointer py-2"
        >
          {/* Main Card */}
          <div className={cn(
            "relative w-full bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-2 md:gap-3 transition-all overflow-hidden",
            "aspect-video md:aspect-[16/10]",
            isDragging ? "border-[var(--accent)] bg-[var(--accent)]/5 scale-[0.98]" : "group-hover:border-white/10 group-hover:bg-white/[0.04]",
            file && "border-green-500/30"
          )}>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg" 
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) validateAndSelect(selectedFile);
              }} 
            />

            <AnimatePresence mode="wait">
              {file ? (
                <motion.div 
                  key="file"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-2 px-4 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 mb-1">
                    <FileText size={20} />
                  </div>
                  <p className="font-medium truncate max-w-[150px] text-xs text-[var(--text-color)]">{file.name}</p>
                  <div className="flex items-center gap-2 text-green-500 text-[9px] font-bold uppercase tracking-widest">
                    <CheckCircle2 size={10} />
                    Ready
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3 px-4 text-center"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[var(--text-color)] opacity-40 transition-colors",
                    isDragging ? "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20 opacity-100" : "group-hover:bg-white/10 group-hover:opacity-100"
                  )}>
                    <UploadCloud size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-xs leading-tight text-[var(--text-color)]">Choose a file or drag & drop it here</p>
                    <p className="opacity-30 text-[9px] text-[var(--text-color)]">PDF or Images, up to 5 MB.</p>
                  </div>
                  <div className="mt-1 px-4 py-1.5 bg-[var(--text-color)] text-[var(--bg-color)] text-[9px] font-bold rounded-lg group-hover:bg-[var(--accent)] group-hover:text-white transition-all shadow-sm">
                    Browse File
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-2">
          {!file ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-[var(--text-color)] opacity-60 hover:opacity-100 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              <UploadCloud size={12} />
              Choose File
            </button>
          ) : (
             <div className="w-full flex gap-2">
               <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(null);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 text-white/40 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all"
              >
                <X size={10} />
                Reset
              </button>
              <div className="flex-[2] flex items-center justify-center gap-1.5 bg-green-500/10 text-green-500 px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                <CheckCircle2 size={10} />
                Selected
              </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

