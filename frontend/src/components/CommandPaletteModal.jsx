import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  Activity, ArrowRight, BookOpen, Clock, Command, CornerDownLeft,
  FileText, Fingerprint, Search, Shield, Sparkles, X, Zap 
} from "lucide-react";

export function CommandPaletteModal({ isOpen, onClose, onNavigate, onSelectWallet }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listContainerRef = useRef(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-scroll selected item into view when navigating with Arrow keys
  useEffect(() => {
    if (!listContainerRef.current) return;
    const selectedBtn = listContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedBtn) {
      selectedBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  const quickActions = [
    { 
      id: "trace-tron", 
      title: "Trace Suspect TRON Mule Node", 
      desc: "TX7sK...victim — 412.5 USDT peeled", 
      icon: Zap, 
      category: "Trace", 
      action: () => { 
        onSelectWallet?.("TX7sK...victim"); 
        onNavigate?.("workspace"); 
        onClose(); 
      } 
    },
    { 
      id: "trace-poly", 
      title: "Inspect Polygon Layering Node", 
      desc: "0xe6d634289cf30114041b63e6358 — Multi-hop Peel Chain", 
      icon: Fingerprint, 
      category: "Trace", 
      action: () => { 
        onSelectWallet?.("0xe6d634289cf30114041b63e6358"); 
        onNavigate?.("workspace"); 
        onClose(); 
      } 
    },
    { 
      id: "nav-workspace", 
      title: "Open Live Attribution Workbench", 
      desc: "Real-time multi-chain graph traversal & VASP clusters", 
      icon: Activity, 
      category: "Navigation", 
      action: () => { 
        onNavigate?.("workspace"); 
        onClose(); 
      } 
    },
    { 
      id: "nav-evidence", 
      title: "Open Cryptographic Evidence Ledger", 
      desc: "49 on-chain Section 65B verified forensic records", 
      icon: BookOpen, 
      category: "Navigation", 
      action: () => { 
        onNavigate?.("evidence"); 
        onClose(); 
      } 
    },
    { 
      id: "nav-watchlist", 
      title: "Open Watchlist Surveillance Queue", 
      desc: "24/7 Autonomous node & hot wallet monitors", 
      icon: Shield, 
      category: "Navigation", 
      action: () => { 
        onNavigate?.("watchlist"); 
        onClose(); 
      } 
    },
    { 
      id: "action-dossier", 
      title: "Generate Section 91 Legal Notice", 
      desc: "Statutory BNSS Sec 94 court-ready freeze directive", 
      icon: FileText, 
      category: "Actions", 
      action: () => { 
        onNavigate?.("dossier"); 
        onClose(); 
      } 
    },
  ];

  const filtered = quickActions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.desc.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  // If user typed a custom wallet address not in the predefined list
  const isCustomWallet = query.trim().length > 5 && !filtered.some(f => f.desc.includes(query.trim()));
  if (isCustomWallet) {
    filtered.unshift({
      id: "custom-wallet",
      title: `Search & Ingest Address: "${query.trim()}"`,
      desc: "Instant cross-chain hops traversal & VASP resolution",
      icon: Search,
      category: "Custom Query",
      action: () => {
        onSelectWallet?.(query.trim());
        onNavigate?.("workspace");
        onClose();
      }
    });
  }

  // Keyboard navigation listener inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered.length > 0 && filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-20 sm:pt-24 p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Dialog Shell */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Quick Intelligence Command Palette"
        className="relative z-10 w-full max-w-xl rounded-3xl border border-[#E5B83B]/30 bg-[#04140D]/98 text-slate-100 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(16,185,129,0.18)] backdrop-blur-3xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 bg-black/50">
          <Search size={19} className="text-[#E5B83B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, address, or target... (↑↓ to navigate, ↵ to run)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500 font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[11px] font-mono text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 border border-white/10"
            >
              Clear
            </button>
          )}
          <button 
            type="button" 
            onClick={onClose}
            className="rounded-xl p-1 text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Items List */}
        <div ref={listContainerRef} className="max-h-[350px] overflow-y-auto p-2.5 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Suggested Quick Actions</span>
            <span>{filtered.length} AVAILABLE</span>
          </div>

          {filtered.length > 0 ? (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  data-index={index}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between w-full p-3 rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                    isSelected 
                      ? "bg-gradient-to-r from-[#006039]/50 to-[#059669]/30 border border-[#E5B83B]/60 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-white" 
                      : "hover:bg-white/[0.06] border border-transparent text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                      isSelected 
                        ? "bg-[#E5B83B] text-[#04140D] border-[#E5B83B] scale-105 shadow-sm" 
                        : "bg-[#E5B83B]/10 text-[#E5B83B] border-[#E5B83B]/25"
                    }`}>
                      <Icon size={17} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <strong className={`block text-xs font-bold truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                        {item.title}
                      </strong>
                      <span className="text-[11px] text-slate-400 font-mono truncate block">
                        {item.desc}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                      isSelected 
                        ? "border-[#E5B83B]/50 bg-[#E5B83B]/20 text-[#FFE28A]" 
                        : "border-white/10 bg-white/5 text-slate-400"
                    }`}>
                      {item.category}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center text-[#FFE28A] text-xs font-mono">
                        <CornerDownLeft size={13} />
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 font-mono">
              No matching commands or entities found for "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-black/60 px-5 py-3 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[10.5px]">
            <Command size={13} className="text-[#E5B83B]" /> CHAKRAVYUH Quick Intelligence
          </span>
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
            <span className="hidden sm:inline">Use <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-200">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-200">↓</kbd> to navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-200">↵</kbd> Select</span>
            <span><kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-200">ESC</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default CommandPaletteModal;
