import { AlertTriangle, Zap, Maximize2, MousePointerClick } from "lucide-react";

export function Recommendations() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">Improvement Recommendations</h1>
        <p className="text-zinc-400">AI-generated suggestions to optimize the analyzed architecture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: "Performance Optimization",
            icon: <Zap className="w-5 h-5 text-amber-500" />,
            severity: "High Impact",
            sevColor: "text-amber-500 border-amber-500/20 bg-amber-500/10",
            description: "Implement finer-grained code splitting. Although Next.js handles route-level splitting, heavy dashboard views could use dynamic imports for charting libraries.",
            action: "Review bundle size map"
          },
          {
            title: "Scalability Enhancements",
            icon: <Maximize2 className="w-5 h-5 text-blue-500" />,
            severity: "Medium Impact",
            sevColor: "text-blue-500 border-blue-500/20 bg-blue-500/10",
            description: "Consider moving the WebSocket connection handler to a dedicated microservice separated from the main GraphQL API to allow independent horizontal scaling during traffic spikes.",
            action: "Extract WS Server"
          },
          {
            title: "UX Refinements",
            icon: <MousePointerClick className="w-5 h-5 text-emerald-500" />,
            severity: "Quick Win",
            sevColor: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
            description: "Some nested modal transitions lack framer-motion layout animations, causing slight layout shifts when complex forms render.",
            action: "Implement LayoutGroup"
          },
          {
            title: "Security & Edge Cases",
            icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
            severity: "Critical",
            sevColor: "text-rose-500 border-rose-500/20 bg-rose-500/10",
            description: "Detected missing CSRF protection headers on several non-GraphQL mutation endpoints used by legacy integrations.",
            action: "Audit Security Headers"
          }
        ].map((rec, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 flex flex-col">
             <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                      {rec.icon}
                   </div>
                   <h3 className="font-semibold text-primary">{rec.title}</h3>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded border ${rec.sevColor}`}>
                  {rec.severity}
                </span>
             </div>
             
             <p className="text-sm text-zinc-400 mb-6 flex-1 leading-relaxed">
               {rec.description}
             </p>
             
             <button className="self-start text-sm font-medium text-zinc-300 hover:text-white px-4 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-lg transition-colors">
               {rec.action}
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
