import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Activity, Database, Layout, Server, ShieldCheck, Star, Clock, Globe, ArrowLeftRight, Layers, Columns, GraduationCap, CheckCircle2, Circle, GitBranch, Zap, Maximize2, MousePointerClick, AlertTriangle, Loader2 } from "lucide-react";
import { api, Report } from "../lib/api";
import { cn } from "@/lib/utils";

export function ShareViewer() {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "database" | "roadmap" | "recommendations">("overview");

  useEffect(() => {
    if (reportId) {
      setIsLoading(true);
      api.getReportById(reportId)
        .then((res) => {
          setReport(res);
        })
        .catch((err) => {
          setError(err.message || "Failed to load shared report. It may have been un-shared or deleted.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [reportId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 font-mono text-xs">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span>ACCESSING CODELENS SECURE VAULT...</span>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 glass rounded-2xl border-red-500/20">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-primary">Failed to Open Report</h2>
          <p className="text-xs text-zinc-400 mt-2 mb-6">{error || "The requested resource could not be found."}</p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase rounded-lg hover:bg-gray-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Custom Share Header */}
      <header className="h-14 px-6 md:px-12 flex items-center justify-between border-b-thin bg-[#090909] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-black rotate-45"></div>
            </div>
            <span className="font-semibold tracking-tight text-lg uppercase text-primary">CodeLens <span className="text-blue-500">AI</span></span>
          </Link>
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] uppercase font-bold tracking-wider">
            Shared Study Material
          </span>
        </div>
        <Link
          to="/analyze"
          className="text-xs bg-zinc-800 text-primary border border-zinc-700 px-4 py-1.5 rounded uppercase font-bold hover:bg-zinc-700 transition-colors"
        >
          Create Your Own Report
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full space-y-8">
        {/* Banner Details */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-display font-bold text-primary">{report.title} Architecture</h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                Public Copy
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Analyzed {new Date(report.createdAt).toLocaleDateString()} • Inferred from observable signals
              {report.inputType === 'url' && (
                <span className="font-mono text-zinc-300 ml-2">({report.domain})</span>
              )}
            </p>
          </div>

          {/* Sub-tab selection */}
          <div className="flex bg-[#111] p-1 rounded-lg border border-[#222] overflow-x-auto shrink-0">
            {[
              { id: "overview", label: "Overview" },
              { id: "architecture", label: "System Nodes" },
              { id: "database", label: "Database" },
              { id: "roadmap", label: "Roadmap" },
              { id: "recommendations", label: "Optimizations" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
                  activeTab === tab.id ? "bg-zinc-800 text-white" : "text-gray-500 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Tech Stack Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { category: "Frontend Core", icon: <Layout className="w-5 h-5 text-blue-400" />, items: report.techStack.frontend },
                { category: "Backend Engine", icon: <Server className="w-5 h-5 text-emerald-400" />, items: report.techStack.backend },
                { category: "Database & Hosting", icon: <Database className="w-5 h-5 text-purple-400" />, items: report.techStack.databaseInfra },
              ].map((stack, i) => (
                <div key={i} className="glass rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#111] border border-zinc-800 shrink-0">
                      {stack.icon}
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{stack.category}</h3>
                  </div>
                  <ul className="space-y-4">
                    {stack.items.map((item, j) => (
                      <li key={j} className="text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-primary flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {item.name}
                          </span>
                          <span className="badge text-[8px]">{item.confidence}% Conf</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-normal pl-3">{item.reason}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Narrative & Side-bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <div className="glass rounded-xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Architecture Summary</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed leading-normal">{report.architectureSummary}</p>
                </div>

                {/* Honesty / Disclaimer */}
                <div className="p-5 glass border border-amber-500/20 bg-amber-500/5 rounded-xl space-y-3">
                  <div className="flex items-center gap-2.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    Academic Honesty Disclosure
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    This document represents a probabilistic software model mapped from external network cues. It is designed solely for educational research and does not verify actual proprietary deployment schemas.
                  </p>
                  <div className="pt-2 border-t border-[#262626]">
                    <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Unobserved Variables:</span>
                    <ul className="list-disc pl-4 space-y-0.5 mt-1">
                      {report.missingInferences.map((inf, idx) => (
                        <li key={idx} className="text-[9px] text-zinc-500 font-mono">{inf}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="glass rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-between">
                    Inference Confidence
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </h3>
                  <div className="space-y-4">
                     {[
                       { label: "Frontend Layer", value: report.techStack.frontend[0]?.confidence || 90 },
                       { label: "API Gateway", value: report.techStack.backend[0]?.confidence || 75 },
                       { label: "Relational DB", value: report.techStack.databaseInfra[0]?.confidence || 60 },
                     ].map((metric, idx) => (
                       <div key={idx}>
                         <div className="flex justify-between text-[11px] mb-1.5">
                           <span className="text-zinc-400">{metric.label}</span>
                           <span className="text-blue-500 font-mono font-semibold">{metric.value}%</span>
                         </div>
                         <div className="h-1 bg-[#222] rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 rounded-full" style={{ width: `${metric.value}%` }} />
                         </div>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Architecture Nodes */}
        {activeTab === "architecture" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="min-h-[400px] bg-zinc-950 border border-border rounded-xl p-8 relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              <div className="relative w-full max-w-4xl flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
                {report.architectureNodes.map((node, index) => (
                  <div key={node.id} className="flex flex-col lg:flex-row items-center w-full lg:w-auto">
                    {index > 0 && (
                      <div className="hidden lg:flex flex-1 items-center justify-center min-w-[50px] mr-6 ml-2 relative">
                        <div className="absolute h-0.5 bg-zinc-800 w-full" />
                        <ArrowLeftRight className="w-3.5 h-3.5 text-zinc-500 relative bg-zinc-950 px-1" />
                      </div>
                    )}

                    <div className="w-full lg:w-60 bg-card border border-zinc-850 rounded-xl shadow-lg p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center border border-blue-500/20">
                          {node.type === 'client' && <Globe className="w-4 h-4" />}
                          {node.type === 'api' && <Server className="w-4 h-4" />}
                          {node.type === 'db' && <Database className="w-4 h-4" />}
                        </div>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500">{node.type}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-primary mb-1">{node.name}</h4>
                      <p className="text-[11px] text-zinc-400 mb-3">{node.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {node.technologies.map(t => (
                          <span key={t} className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-400 font-mono">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inferred UI/UX Structures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="glass rounded-xl p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Styling & Grid Containers</span>
                <p className="text-xs text-zinc-400 leading-normal">{report.uiUxAnalysis.layouts}</p>
              </div>
              <div className="glass rounded-xl p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Typography & Hierarchy</span>
                <p className="text-xs text-zinc-400 leading-normal">{report.uiUxAnalysis.typography}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Database */}
        {activeTab === "database" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Hypothesized Database Tables</h3>
              {report.databaseHypothesis.tables.map((table, tIdx) => (
                <div key={tIdx} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-[#111] px-4 py-2 border-b border-border flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-mono font-bold text-primary">{table.name}</span>
                  </div>
                  <div className="p-3">
                    <table className="w-full text-[11px] text-zinc-400">
                      <thead>
                        <tr className="border-b border-zinc-850 text-left text-[9px] font-bold text-zinc-500 uppercase pb-1 tracking-wider">
                          <th className="pb-1.5 w-1/3">Column</th>
                          <th className="pb-1.5 w-1/3">Type</th>
                          <th className="pb-1.5 w-1/3 text-right">Constraint</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.columns.map((col, cIdx) => (
                          <tr key={cIdx} className="border-b border-zinc-900 last:border-b-0">
                            <td className="py-1.5 font-mono text-zinc-300">{col.name}</td>
                            <td className="py-1.5 font-mono text-zinc-500">{col.type}</td>
                            <td className="py-1.5 font-mono text-right text-purple-400 font-bold">{col.key || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-950 border border-border rounded-xl p-6 flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-2">
                <Columns className="w-4 h-4 text-purple-400" /> Schema Class Specification
              </h3>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">Mermaid diagram representing structural table classes and foreign relations:</p>
              <pre className="flex-1 bg-black p-4 rounded-lg font-mono text-xs text-purple-300 overflow-x-auto border border-zinc-900 select-all">
                {report.databaseHypothesis.mermaidDiagram}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Roadmap */}
        {activeTab === "roadmap" && (
          <div className="relative border-l border-zinc-850 ml-4 md:ml-6 space-y-10 pb-12 animate-fadeIn max-w-3xl mx-auto">
            {report.learningRoadmap.map((step, index) => (
              <div key={step.id} className="relative pl-8 md:pl-12">
                <div className="absolute left-[-11px] top-1 bg-background p-0.5 rounded-full text-zinc-600">
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 bg-background text-emerald-500 rounded-full" />
                  ) : step.status === "current" ? (
                    <GitBranch className="w-5 h-5 bg-background text-indigo-500" />
                  ) : (
                    <Circle className="w-5 h-5 bg-background text-zinc-850" />
                  )}
                </div>

                <div className="border border-zinc-850 rounded-xl p-5 bg-zinc-900/10">
                  <h4 className="font-semibold text-sm text-primary">Module {index + 1}: {step.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-normal">{step.description}</p>
                  
                  <div className="mt-4 pt-3 border-t border-zinc-900">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Required Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {step.tech.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 bg-zinc-950 border border-zinc-805 rounded text-[10px] text-zinc-400 font-mono">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Recommendations */}
        {activeTab === "recommendations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {report.improvementSuggestions.map((rec, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-primary text-sm">{rec.title}</h4>
                    <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {rec.severity}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">{rec.description}</p>
                </div>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-2">Recommended: {rec.action}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-[10px] font-mono text-gray-600 border-t-thin bg-[#090909]">
        <p>&copy; 2026 CodeLens AI. Inferences based on client telemetry indicators.</p>
      </footer>
    </div>
  );
}
