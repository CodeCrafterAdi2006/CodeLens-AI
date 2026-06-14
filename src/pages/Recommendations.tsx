import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Zap, Maximize2, MousePointerClick, HelpCircle } from "lucide-react";
import { api, Report } from "../lib/api";

export function Recommendations() {
  const [report, setReport] = useState<Report | null>(api.getActiveReport());

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
          <p className="text-xs text-zinc-400 mt-2 mb-6">Suggestions are dynamically compiled once a URL or screenshot is uploaded.</p>
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

  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "text-red-400 border-red-500/20 bg-red-500/10";
      case "high impact":
        return "text-amber-400 border-amber-500/20 bg-amber-500/10";
      case "medium impact":
        return "text-blue-400 border-blue-500/20 bg-blue-500/10";
      default:
        return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    }
  };

  const getIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "high impact":
        return <Zap className="w-5 h-5 text-amber-400" />;
      case "medium impact":
        return <Maximize2 className="w-5 h-5 text-blue-400" />;
      default:
        return <MousePointerClick className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 relative">
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mb-10 relative">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">Improvement Recommendations</h1>
        <p className="text-zinc-400 text-sm">Suggested engineering edits and optimizations tailored for {report.title}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {report.improvementSuggestions.map((rec, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors">
             <div>
               <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                        {getIcon(rec.severity)}
                     </div>
                     <h3 className="font-semibold text-primary text-sm">{rec.title}</h3>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityStyle(rec.severity)}`}>
                    {rec.severity}
                  </span>
               </div>
               
               <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                 {rec.description}
               </p>
             </div>
             
             <button className="self-start text-[10px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white px-3 py-2 border border-zinc-850 hover:bg-zinc-900 rounded-lg transition-colors">
               {rec.action}
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
