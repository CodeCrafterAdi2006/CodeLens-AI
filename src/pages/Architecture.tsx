import { ArrowLeftRight, Database, Globe, Layers, Server } from "lucide-react";

export function Architecture() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8 shrink-0">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">Architecture Explorer</h1>
        <p className="text-zinc-400">Interactive overview of the inferred software architecture for Linear App.</p>
      </div>

      {/* Diagram Area - We'll use a styled CSS grid to simulate a node-based architecture diagram */}
      <div className="flex-1 min-h-[500px] bg-zinc-950 border border-border rounded-xl p-8 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Abstract Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative w-full max-w-4xl flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
          
          {/* Frontend Node */}
          <div className="w-full lg:w-64 bg-card border border-zinc-700/80 rounded-xl shadow-xl p-5 relative group hover:border-indigo-500/50 transition-colors">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-300">Client</span>
              </div>
              <h3 className="font-semibold text-primary mb-1">React SPA</h3>
              <p className="text-xs text-zinc-400 mb-4">State managed by Zustand, local persistence via IndexedDB.</p>
              
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Key Packages</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-zinc-800 rounded text-[11px] text-zinc-300">next</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded text-[11px] text-zinc-300">react-dom</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded text-[11px] text-zinc-300">framer-motion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Line */}
          <div className="hidden lg:flex flex-1 items-center justify-center relative">
            <div className="absolute h-0.5 bg-zinc-800 w-full left-0 right-0"></div>
            <ArrowLeftRight className="w-5 h-5 text-zinc-500 relative bg-zinc-950 px-1" />
            <div className="absolute -top-6 text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              WSS / GraphQL
            </div>
          </div>

          {/* Backend Node */}
          <div className="w-full lg:w-64 bg-card border border-zinc-700/80 rounded-xl shadow-xl p-5 relative group hover:border-emerald-500/50 transition-colors">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                  <Server className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-300">API Layer</span>
              </div>
              <h3 className="font-semibold text-primary mb-1">Node.js Sync Server</h3>
              <p className="text-xs text-zinc-400 mb-4">Resolves GraphQL mutations and manages real-time socket events.</p>
              
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Technologies</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-zinc-800 rounded text-[11px] text-zinc-300">Node</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded text-[11px] text-zinc-300">Apollo</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded text-[11px] text-zinc-300">Redis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Line */}
          <div className="hidden lg:flex flex-1 items-center justify-center relative">
            <div className="absolute h-0.5 bg-zinc-800 w-full left-0 right-0"></div>
            <Layers className="w-4 h-4 text-zinc-500 relative bg-zinc-950 px-1" />
          </div>

          {/* Database Node */}
          <div className="w-full lg:w-64 bg-card border border-zinc-700/80 rounded-xl shadow-xl p-5 relative group hover:border-purple-500/50 transition-colors">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-purple-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                  <Database className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-300">Data Base</span>
              </div>
              <h3 className="font-semibold text-primary mb-1">PostgreSQL DB</h3>
              <p className="text-xs text-zinc-400 mb-4">Primary relational storage, likely clustered for high availability.</p>
              
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Features</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-zinc-800 rounded text-[11px] text-zinc-300">ACID</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded text-[11px] text-zinc-300">Prisma</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
