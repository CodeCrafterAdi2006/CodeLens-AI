import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight, Database, Globe, Layers, Server, HelpCircle, Shield, Key, Columns, RefreshCw } from "lucide-react";
import { api, Report } from "../lib/api";

export function Architecture() {
  const [report, setReport] = useState<Report | null>(api.getActiveReport());
  const [activeSubTab, setActiveSubTab] = useState<"diagram" | "uiux" | "database">("diagram");

  useEffect(() => {
    if (!report && api.getToken()) {
      api.getReports().then((list) => {
        if (list.length > 0) {
          setReport(list[0]);
        }
      });
    }
  }, [report]);

  if (!report) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 glass rounded-2xl relative">
          <HelpCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-primary">No Active Analysis</h2>
          <p className="text-xs text-zinc-400 mt-2 mb-6">Submit a URL or screenshot first to explore its architecture structure.</p>
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
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 relative">
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">Architecture Explorer</h1>
          <p className="text-zinc-400 text-sm">Interactive structural model inferred for {report.title}.</p>
        </div>
        
        {/* Navigation sub-tabs */}
        <div className="flex bg-[#111] p-1 rounded-lg border border-[#222]">
          {[
            { id: "diagram", label: "System Diagram" },
            { id: "uiux", label: "UI/UX Analysis" },
            { id: "database", label: "Database Hypothesis" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeSubTab === tab.id ? "bg-zinc-800 text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tab Content: System Diagram */}
      {activeSubTab === "diagram" && (
        <div className="space-y-6">
          <div className="min-h-[450px] bg-zinc-950 border border-border rounded-xl p-8 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Abstract Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <div className="relative w-full max-w-4xl flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
              {report.architectureNodes.map((node, index) => (
                <div key={node.id} className="flex flex-col lg:flex-row items-center w-full lg:w-auto">
                  {/* Connection line prior to node (except first node) */}
                  {index > 0 && (
                    <div className="hidden lg:flex flex-1 items-center justify-center min-w-[60px] relative mr-6 ml-2">
                      <div className="absolute h-0.5 bg-zinc-800 w-full left-0 right-0" />
                      <ArrowLeftRight className="w-4 h-4 text-zinc-500 relative bg-zinc-950 px-1" />
                    </div>
                  )}

                  {/* The Node box */}
                  <div className={`w-full lg:w-64 bg-card border ${
                    node.type === 'client' ? 'border-blue-500/30' :
                    node.type === 'api' ? 'border-emerald-500/30' :
                    'border-purple-500/30'
                  } rounded-xl shadow-xl p-5 relative group hover:scale-[1.02] transition-all`}>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 ${
                          node.type === 'client' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          node.type === 'api' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        } rounded-lg flex items-center justify-center border`}>
                          {node.type === 'client' && <Globe className="w-5 h-5" />}
                          {node.type === 'api' && <Server className="w-5 h-5" />}
                          {node.type === 'db' && <Database className="w-5 h-5" />}
                          {node.type === 'cache' && <Layers className="w-5 h-5" />}
                          {node.type === 'cdn' && <Layers className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-850 px-2 py-1 rounded text-zinc-400">
                          {node.type}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-primary mb-1">{node.name}</h3>
                      <p className="text-xs text-zinc-400 mb-4 leading-normal">{node.description}</p>
                      
                      <div className="space-y-2">
                        <div className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Inferred Frameworks</div>
                        <div className="flex flex-wrap gap-1.5">
                          {node.technologies.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-zinc-900/30 border border-border rounded-xl flex items-start gap-3 text-xs text-zinc-400 leading-relaxed">
            <Shield className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
            <p>
              <strong>System Connectivity:</strong> The frontend client issues asynchronous fetch operations targeting the API gateway. The gateway validates request auth parameters, queries persistent DB collections, and structures response buffers.
            </p>
          </div>
        </div>
      )}

      {/* Sub-tab Content: UI/UX Analysis */}
      {activeSubTab === "uiux" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Typography & Layout Hierarchy", content: report.uiUxAnalysis.typography },
            { title: "Inferred Grids & Layout Containers", content: report.uiUxAnalysis.layouts },
            { title: "Styling & Design System Tokens", content: report.uiUxAnalysis.designTokens },
            { title: "UX Micro-interactions & Accessibility", content: report.uiUxAnalysis.details },
          ].map((card, i) => (
            <div key={i} className="glass rounded-xl p-6 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 border-b border-zinc-800 pb-2">{card.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{card.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab Content: Database Hypothesis */}
      {activeSubTab === "database" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Table Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Hypothesized Relational Schema</h3>
              {report.databaseHypothesis.tables.map((table, tIdx) => (
                <div key={tIdx} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-[#111] px-4 py-2.5 border-b border-border flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-mono font-bold text-primary">{table.name}</span>
                  </div>
                  
                  <div className="p-3">
                    <table className="w-full text-[11px] text-zinc-400">
                      <thead>
                        <tr className="border-b border-zinc-850 text-left text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                          <th className="pb-1.5 w-1/3">Column</th>
                          <th className="pb-1.5 w-1/3">Type</th>
                          <th className="pb-1.5 w-1/3 text-right">Key</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.columns.map((col, cIdx) => (
                          <tr key={cIdx} className="border-b border-zinc-900 last:border-b-0">
                            <td className="py-2 font-mono text-zinc-300">{col.name}</td>
                            <td className="py-2 font-mono text-zinc-500">{col.type}</td>
                            <td className="py-2 font-mono text-right text-purple-400 font-bold">{col.key || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {table.relations.length > 0 && (
                    <div className="bg-zinc-950 px-4 py-2 border-t border-border/40 text-[10px] text-zinc-500 flex flex-col gap-1">
                      <span className="font-bold text-[8px] uppercase tracking-wider text-zinc-500">Foreign Constraints:</span>
                      {table.relations.map((rel, rIdx) => (
                        <span key={rIdx} className="font-mono text-purple-400/80">{rel}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mermaid Schema Render Box */}
            <div className="bg-zinc-950 border border-border rounded-xl p-6 flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-4 flex items-center gap-2">
                <Columns className="w-4 h-4 text-purple-400" /> Schema Class Specification
              </h3>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                Copy this Mermaid DSL diagram notation into any parser (e.g. Mermaid Live Editor) to visualize full entity diagrams.
              </p>
              
              <pre className="flex-1 bg-black p-4 rounded-lg font-mono text-xs text-purple-300 overflow-x-auto border border-zinc-900 leading-normal selection:bg-purple-500/20 select-all">
                {report.databaseHypothesis.mermaidDiagram}
              </pre>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
