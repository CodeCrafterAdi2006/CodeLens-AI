import { BookOpen, CheckCircle2, Circle, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

export function Roadmap() {
  const roadmapSteps = [
    {
      id: 1,
      title: "UI & Component Fundamentals",
      description: "Master React concepts, hooks, and responsive styling with Tailwind.",
      status: "completed",
      tech: ["React Base", "TailwindCSS", "Framer Motion"]
    },
    {
      id: 2,
      title: "State Management & Caching",
      description: "Learn how to manage complex application state and cache API responses.",
      status: "current",
      tech: ["Zustand", "React Query", "Context API"]
    },
    {
      id: 3,
      title: "API Design & Data Fetching",
      description: "Understand GraphQL schemas, resolvers, and optimistic updates.",
      status: "upcoming",
      tech: ["GraphQL", "Apollo Client", "Node.js"]
    },
    {
      id: 4,
      title: "Real-time Synchronization",
      description: "Implement WebSockets for live collaboration and offline-first support.",
      status: "upcoming",
      tech: ["Socket.io", "IndexedDB", "CRDTs"]
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">Learning Roadmap</h1>
        <p className="text-zinc-400">Your personalized path to building a Linear-like architecture from scratch.</p>
      </div>

      <div className="relative border-l border-zinc-800 ml-4 md:ml-6 space-y-10 pb-12">
        {roadmapSteps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          
          return (
            <div key={step.id} className="relative pl-8 md:pl-12">
              {/* Timeline Marker */}
              <div className={cn(
                "absolute left-[-11px] top-1 bg-background p-0.5 rounded-full",
                isCompleted ? "text-emerald-500" : isCurrent ? "text-indigo-500" : "text-zinc-700"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 bg-background rounded-full" />
                ) : isCurrent ? (
                  <GitBranch className="w-5 h-5 bg-background text-indigo-500" />
                ) : (
                  <Circle className="w-5 h-5 bg-background" />
                )}
              </div>

              <div className={cn(
                "border rounded-xl p-6 transition-colors",
                isCurrent 
                  ? "border-indigo-500/50 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.05)]" 
                  : isCompleted 
                    ? "border-zinc-800 bg-card/50" 
                    : "border-zinc-800/50 bg-zinc-900/30 opacity-70"
              )}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={cn(
                      "text-lg font-semibold",
                      isCurrent ? "text-indigo-400" : "text-primary"
                    )}>
                      Module {index + 1}: {step.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">{step.description}</p>
                  </div>
                  {isCurrent && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                      <BookOpen className="w-3 h-3" /> In Progress
                    </span>
                  )}
                </div>

                <div className="mt-5 pt-5 border-t border-zinc-800/50">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                    Target Technologies
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {step.tech.map(t => (
                      <span key={t} className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-zinc-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {isCurrent && (
                  <div className="mt-6 flex justify-end">
                     <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors">
                       Continue Learning
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
