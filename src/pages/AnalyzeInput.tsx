import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link2, Image as ImageIcon, Sparkles, UploadCloud, ArrowRight, Loader2, Link as LinkIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, Report } from "../lib/api";

interface AnalysisStep {
  id: number;
  label: string;
  status: "idle" | "running" | "done" | "error";
}

export function AnalyzeInput() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"url" | "image" | "desc">("url");
  const [inputValue, setInputValue] = useState("");
  const [descValue, setDescValue] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { id: 1, label: "Initiating scanning agent and verifying targets", status: "idle" },
    { id: 2, label: "Fetching page payload and analyzing HTTP headers", status: "idle" },
    { id: 3, label: "Extracting DOM signals, script imports, and styling assets", status: "idle" },
    { id: 4, label: "Consulting AI Engine to infer stack dependencies", status: "idle" },
    { id: 5, label: "Formulating database schema & engineering roadmap", status: "idle" }
  ]);

  const runStepSimulation = async (totalMs: number, onUpdate: (stepIdx: number, status: "running" | "done") => void) => {
    const stepDuration = totalMs / steps.length;
    for (let i = 0; i < steps.length; i++) {
      onUpdate(i, "running");
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      onUpdate(i, "done");
    }
  };

  const handleURLSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    setIsLoading(true);
    setErrorMessage("");
    
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: "idle" })));

    let hasEnded = false;
    
    // Run simulation parallel to actual API request
    const simulationPromise = (async () => {
      for (let i = 0; i < steps.length; i++) {
        if (hasEnded) break;
        setSteps(prev => {
          const next = [...prev];
          next[i].status = "running";
          return next;
        });
        // Wait 1.5 seconds per step, but stop early if the request finished
        for (let delay = 0; delay < 15; delay++) {
          if (hasEnded) break;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        setSteps(prev => {
          const next = [...prev];
          if (next[i].status === "running") {
            next[i].status = "done";
          }
          return next;
        });
      }
    })();

    try {
      const report = await api.analyzeURL(inputValue);
      hasEnded = true;
      await simulationPromise;
      // Mark all remaining steps done
      setSteps(prev => prev.map(s => ({ ...s, status: "done" })));
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err: any) {
      hasEnded = true;
      setSteps(prev => prev.map(s => s.status === "running" ? { ...s, status: "error" } : s));
      setErrorMessage(err.message || "Failed to analyze URL website signals");
      setIsLoading(false);
    }
  };

  const handleDescSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descValue) return;
    setIsLoading(true);
    setErrorMessage("");

    setSteps(prev => prev.map(s => ({ ...s, status: "idle" })));

    let hasEnded = false;
    const simulationPromise = (async () => {
      for (let i = 0; i < steps.length; i++) {
        if (hasEnded) break;
        setSteps(prev => {
          const next = [...prev];
          next[i].status = "running";
          return next;
        });
        for (let delay = 0; delay < 15; delay++) {
          if (hasEnded) break;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        setSteps(prev => {
          const next = [...prev];
          if (next[i].status === "running") {
            next[i].status = "done";
          }
          return next;
        });
      }
    })();

    try {
      const report = await api.analyzeDescription(descValue);
      hasEnded = true;
      await simulationPromise;
      setSteps(prev => prev.map(s => ({ ...s, status: "done" })));
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err: any) {
      hasEnded = true;
      setSteps(prev => prev.map(s => s.status === "running" ? { ...s, status: "error" } : s));
      setErrorMessage(err.message || "Failed to analyze description specs");
      setIsLoading(false);
    }
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotBase64) return;
    setIsLoading(true);
    setErrorMessage("");

    setSteps(prev => prev.map(s => ({ ...s, status: "idle" })));

    let hasEnded = false;
    const simulationPromise = (async () => {
      for (let i = 0; i < steps.length; i++) {
        if (hasEnded) break;
        setSteps(prev => {
          const next = [...prev];
          next[i].status = "running";
          return next;
        });
        for (let delay = 0; delay < 15; delay++) {
          if (hasEnded) break;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        setSteps(prev => {
          const next = [...prev];
          if (next[i].status === "running") {
            next[i].status = "done";
          }
          return next;
        });
      }
    })();

    try {
      const report = await api.analyzeScreenshot(screenshotBase64, screenshotName);
      hasEnded = true;
      await simulationPromise;
      setSteps(prev => prev.map(s => ({ ...s, status: "done" })));
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err: any) {
      hasEnded = true;
      setSteps(prev => prev.map(s => s.status === "running" ? { ...s, status: "error" } : s));
      setErrorMessage(err.message || "Failed to analyze screenshot visual tokens");
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File exceeds 5MB size constraint.");
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setScreenshotBase64(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 relative">
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mb-10 relative">
        <h1 className="text-3xl font-display font-bold tracking-tight text-primary mb-2">
          New Analysis
        </h1>
        <p className="text-zinc-400 text-sm">
          Submit a public URL, upload an application screenshot, or write a plain-text engineering specification.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-semibold">Analysis Interrupted</span>
            <p className="mt-1 text-zinc-400">{errorMessage}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="glass rounded-xl p-8 space-y-6 animate-pulse relative">
          <div className="flex items-center gap-3 mb-6">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Analysis Telemetry Pipeline</h3>
          </div>
          
          <div className="space-y-4 font-mono text-xs">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-3 transition-all">
                <div className="mt-0.5">
                  {step.status === "done" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  {step.status === "running" && <Loader2 className="w-4 h-4 animate-spin text-blue-500 shrink-0" />}
                  {step.status === "idle" && <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-800 shrink-0 m-0.5" />}
                  {step.status === "error" && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                </div>
                <span className={cn(
                  step.status === "done" ? "text-emerald-400" :
                  step.status === "running" ? "text-blue-400 font-semibold" :
                  "text-zinc-600"
                )}>
                  {step.label}...
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden mt-6 relative">
          {/* Tabs */}
          <div className="flex border-b border-[#262626] bg-[#090909]">
            {[
              { id: "url", label: "Website URL", icon: <Link2 className="w-4 h-4" /> },
              { id: "image", label: "Screenshot", icon: <ImageIcon className="w-4 h-4" /> },
              { id: "desc", label: "Description", icon: <Sparkles className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-[3px]",
                  activeTab === tab.id 
                    ? "border-blue-500 text-white" 
                    : "border-transparent text-gray-500 hover:text-white"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Container */}
          <div className="p-8">
            {activeTab === "url" && (
              <form onSubmit={handleURLSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Target Application URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      required
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full bg-[#111] border border-[#222] rounded-md py-3 pl-10 pr-3 text-xs focus:border-blue-500 outline-none text-white transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">We inspect public cookies, metadata, style guides, and DNS packets. No code is decompiled.</p>
                </div>

                <button
                  type="submit"
                  disabled={!inputValue}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded text-xs font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  Analyze Target <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {activeTab === "image" && (
              <form onSubmit={handleImageSubmit} className="space-y-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {screenshotBase64 ? (
                  <div className="border border-zinc-700 bg-zinc-900/40 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-full max-h-48 overflow-hidden rounded border border-[#333] mb-4 flex items-center justify-center">
                      <img src={screenshotBase64} alt="Screenshot preview" className="max-h-full max-w-full object-contain" />
                    </div>
                    <p className="text-xs font-semibold text-primary mb-1">{screenshotName}</p>
                    <button
                      type="button"
                      onClick={() => { setScreenshotBase64(null); setScreenshotName(""); }}
                      className="text-[10px] text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider mt-1"
                    >
                      Clear File
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={triggerFileSelect}
                    className="border border-dashed border-[#333] hover:border-blue-500/50 bg-[#111] rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-[#161616] rounded-full flex items-center justify-center mb-4 text-gray-500 border border-[#262626]">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-white mb-1">Click to upload screenshot</p>
                    <p className="text-[10px] text-zinc-500">Supports SVG, PNG, JPG (Max 5MB)</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!screenshotBase64}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded text-xs font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  Analyze Screenshot Layout <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {activeTab === "desc" && (
              <form onSubmit={handleDescSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Product Description</label>
                  <textarea
                    placeholder="Describe the application you want to reverse engineer (e.g., A client dashboard where users log in, manage project sprints, and view analytics reports with charts. It uses WebSockets for real-time chat updates.)"
                    required
                    rows={5}
                    value={descValue}
                    onChange={(e) => setDescValue(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] rounded-md p-3 text-xs focus:border-blue-500 outline-none text-white transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!descValue}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded text-xs font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  Synthesize Specifications <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Recents banner if there is history */}
      <RecentScansLoader />
    </div>
  );
}

function RecentScansLoader() {
  const navigate = useNavigate();
  const [recents, setRecents] = useState<Report[]>([]);

  useEffect(() => {
    if (api.getToken()) {
      api.getReports()
        .then(res => setRecents(res.slice(0, 2)))
        .catch(() => {});
    }
  }, []);

  const handleLoadRecent = (report: Report) => {
    api.setActiveReport(report);
    navigate("/dashboard");
  };

  if (recents.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Your Recent Analyses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {recents.map((item) => (
           <div 
             key={item.id} 
             onClick={() => handleLoadRecent(item)}
             className="p-4 bg-[#161616] border border-[#262626] rounded-lg group cursor-pointer hover:bg-[#111] transition-colors flex items-start justify-between"
           >
              <div>
                 <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   {item.title}
                 </h4>
                 <p className="text-xs text-gray-500 mt-2">{item.inputType === 'url' ? item.domain : 'Custom Scan'}</p>
                 <p className="text-[9px] font-mono text-gray-400 mt-2 uppercase tracking-wider">
                   {item.techStack.frontend[0]?.name || 'Web Stack'} / {item.techStack.backend[0]?.name || 'REST API'}
                 </p>
              </div>
              <div className="w-6 h-6 rounded bg-[#222] border border-[#333] flex items-center justify-center text-gray-500 group-hover:text-blue-500 group-hover:border-blue-500/50 transition-colors shrink-0">
                 <ArrowRight className="w-3 h-3" />
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
