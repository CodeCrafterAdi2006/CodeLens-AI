import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Circle, GitBranch, HelpCircle, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, Report } from "../lib/api";

export function Roadmap() {
  const [report, setReport] = useState<Report | null>(api.getActiveReport());
  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    if (!report && api.getToken()) {
      api.getReports().then((list) => {
        if (list.length > 0) {
          setReport(list[0]);
        }
      });
    }
  }, [report]);

  useEffect(() => {
    if (report) {
      setSteps(report.learningRoadmap);
    }
  }, [report]);

  const handleMarkCompleted = (stepId: number) => {
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        return { ...s, status: "completed" };
      }
      // Set next incomplete as current
      if (s.id === stepId + 1 && s.status === "upcoming") {
        return { ...s, status: "current" };
      }
      return s;
    }));
  };

  if (!report) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 glass rounded-2xl relative">
          <HelpCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-primary">No Active Analysis</h2>
          <p className="text-xs text-zinc-400 mt-2 mb-6">Explore roadmaps after analyzing an application website or screenshot.</p>
          <Link
            to="/analyze"
            className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase rounded-lg hover:bg-gray-200"
          >
            Start Analyzing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 relative">
      <div className="absolute inset-0 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mb-10 relative">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-display font-bold text-primary">Learning Roadmap</h1>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] uppercase font-bold tracking-wider">
            {report.title} Path
          </span>
        </div>
        <p className="text-zinc-400 text-sm">A structured educational path to building an application of this scale from scratch.</p>
      </div>

      <div className="relative border-l border-zinc-800 ml-4 md:ml-6 space-y-10 pb-12 relative">
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          
          return (
            <div key={step.id} className="relative pl-8 md:pl-12">
              {/* Timeline Marker */}
              <div className={cn(
                "absolute left-[-11px] top-1 bg-background p-0.5 rounded-full z-10",
                isCompleted ? "text-emerald-500" : isCurrent ? "text-indigo-500" : "text-zinc-700"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 bg-background rounded-full" />
                ) : isCurrent ? (
                  <GitBranch className="w-5 h-5 bg-background text-indigo-500" />
                ) : (
                  <Circle className="w-5 h-5 bg-background text-zinc-700" />
                )}
              </div>

              <div className={cn(
                "border rounded-xl p-6 transition-all duration-300",
                isCurrent 
                  ? "border-indigo-500/40 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.03)] scale-[1.01]" 
                  : isCompleted 
                    ? "border-zinc-800/80 bg-zinc-900/10 opacity-80" 
                    : "border-zinc-900 bg-zinc-900/5 opacity-50"
              )}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={cn(
                      "text-base font-semibold",
                      isCurrent ? "text-indigo-400" : "text-primary"
                    )}>
                      Module {index + 1}: {step.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-normal">{step.description}</p>
                  </div>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] uppercase font-bold tracking-wider border border-indigo-500/20">
                      <BookOpen className="w-3 h-3" /> Study Target
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] uppercase font-bold tracking-wider border border-emerald-500/20">
                      Completed
                    </span>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-900">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                    Key Skill Objectives
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {step.tech.map((t: string) => (
                      <span key={t} className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[10px] text-zinc-400 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {isCurrent && (
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => handleMarkCompleted(step.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4" /> Mark Module Complete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
