import { Activity, Database, Layout, Server, Sparkles, ShieldCheck } from "lucide-react";

export function Dashboard() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-bold text-primary">Linear App Analysis</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              Analyzed
            </span>
          </div>
          <a href="https://linear.app" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-1 group">
            linear.app <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-zinc-800 text-sm font-medium rounded-md hover:bg-zinc-700 transition-colors">
            Share Report
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Export Config
          </button>
        </div>
      </div>

      {/* Tech Stack Prediction */}
      <section className="col-span-8 flex flex-col gap-6">
        <h2 className="text-lg font-semibold mb-2 text-zinc-200">Predicted Technology Stack</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { category: "Frontend", icon: <Layout className="w-5 h-5 text-blue-400" />, items: ["React 18", "Next.js", "Tailwind CSS", "Zustand"] },
            { category: "Backend", icon: <Server className="w-5 h-5 text-emerald-400" />, items: ["Node.js", "GraphQL API", "Apollo Server", "Redis"] },
            { category: "Database & Infra", icon: <Database className="w-5 h-5 text-purple-400" />, items: ["PostgreSQL", "Prisma ORM", "AWS Cloud", "Docker"] },
          ].map((stack, i) => (
            <div key={i} className="glass rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#111] border border-zinc-800">
                  {stack.icon}
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{stack.category}</h3>
              </div>
              <ul className="space-y-2">
                {stack.items.map((item, j) => (
                  <li key={j} className="flex items-center justify-between text-sm text-zinc-400">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      {item}
                    </span>
                    <span className="badge text-[9px]">{95 - j * 5}% CONF</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Confidence & Architecture Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 glass rounded-xl p-5 overflow-hidden flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Architecture Summary</h3>
            <div className="prose prose-invert prose-sm max-w-none text-zinc-400 leading-relaxed">
              <p>
                Based on client-side analysis and network payload inspection, Linear appears to utilize a highly optimized <strong className="text-primary">React-based Single Page Application (SPA)</strong> architecture, likely powered by Next.js for initial delivery and SSR advantages.
              </p>
              <p className="mt-4">
                The data layer relies heavily on <strong className="text-primary">GraphQL</strong> with local caching mechanisms, enabling optimistic UI updates and an offline-first experience. Real-time synchronization is handled via WebSockets, interacting with a scalable Node.js backend.
              </p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-[#262626] flex flex-wrap gap-2">
              {["Optimistic UI", "Offline-first", "Real-time Sync", "Sync Engine"].map(tag => (
                <span key={tag} className="badge bg-black border-[#333]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 glass rounded-xl p-5 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center justify-between">
              Analysis Confidence
              <ShieldCheck className="w-4 h-4 text-blue-500" />
            </h3>
            
            <div className="space-y-4">
               {[
                 { label: "Frontend Framework", value: 98 },
                 { label: "Styling Solution", value: 85 },
                 { label: "API Protocol", value: 95 },
                 { label: "Database Engine", value: 70 },
               ].map((metric, i) => (
                 <div key={i}>
                   <div className="flex justify-between text-xs mb-2">
                     <span className="text-zinc-400">{metric.label}</span>
                     <span className="text-blue-500 font-mono">{metric.value}%</span>
                   </div>
                   <div className="h-1 bg-[#222] rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-blue-500 rounded-full relative"
                       style={{ width: `${metric.value}%` }}
                     >
                       <div className="absolute inset-0 bg-white/20 w-full" style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="glass rounded-xl p-5 flex items-start gap-4 border border-blue-500/30 bg-blue-500/5">
            <Activity className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Live Telemetry Alert</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Detected WebAssembly (Wasm) modules being loaded for local SQLite sync operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
