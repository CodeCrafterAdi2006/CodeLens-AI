import { Award, Briefcase, FileCode2, History, TrendingUp } from "lucide-react";

export function Profile() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-indigo-500/10 border-4 border-zinc-900 shadow-xl flex items-center justify-center relative">
           <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
           <span className="text-3xl font-display font-bold text-indigo-400 relative z-10">JS</span>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-primary mb-1">Jane Student</h1>
          <p className="text-zinc-400 text-sm mb-4">CS Major @ Tech University • Pro Tier Member</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
             <div className="flex items-center gap-2 text-sm text-zinc-300">
               <History className="w-4 h-4 text-zinc-500" />
               <span className="font-semibold">24</span> Analyses
             </div>
             <div className="flex items-center gap-2 text-sm text-zinc-300">
               <TrendingUp className="w-4 h-4 text-emerald-500" />
               <span className="font-semibold">Lvl 12</span> Mastery
             </div>
          </div>
        </div>
        
        <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-primary rounded-lg font-medium transition-colors text-sm">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Saved Analyses */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-zinc-500" />
              Saved Analyses Library
            </h2>
            
            <div className="space-y-3">
              {[
                { name: "Linear App", date: "2 days ago", type: "SPA / Next.js" },
                { name: "Vercel Platform", date: "1 week ago", type: "Serverless Edge" },
                { name: "Stripe Dashboard", date: "2 weeks ago", type: "React / Ruby on Rails" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 border border-transparent hover:border-zinc-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-900 rounded-md border border-zinc-800 flex items-center justify-center">
                       <FileCode2 className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-primary">{item.name}</h4>
                      <p className="text-xs text-zinc-500">{item.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Learning Progress */}
          <div className="bg-card border border-border rounded-xl p-6">
             <h2 className="text-lg font-semibold text-primary mb-6">Learning Progress</h2>
             
             <div className="space-y-5">
               <div>
                 <div className="flex justify-between text-sm mb-1.5">
                   <span className="text-zinc-300">React Architecture</span>
                   <span className="text-zinc-500">80%</span>
                 </div>
                 <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 rounded-full w-[80%]" />
                 </div>
               </div>
               
               <div>
                 <div className="flex justify-between text-sm mb-1.5">
                   <span className="text-zinc-300">GraphQL APIs</span>
                   <span className="text-zinc-500">45%</span>
                 </div>
                 <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-pink-500 rounded-full w-[45%]" />
                 </div>
               </div>
               
               <div>
                 <div className="flex justify-between text-sm mb-1.5">
                   <span className="text-zinc-300">System Design</span>
                   <span className="text-zinc-500">60%</span>
                 </div>
                 <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 rounded-full w-[60%]" />
                 </div>
               </div>
             </div>
          </div>

          {/* Achievements */}
          <div className="bg-card border border-border rounded-xl p-6">
             <h2 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
               <Award className="w-5 h-5 text-amber-500" />
               Achievements
             </h2>
             
             <div className="space-y-4">
                <div className="flex gap-4">
                   <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-amber-500 shrink-0">
                      <Search className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="text-sm font-medium text-primary">First Discovery</h4>
                      <p className="text-xs text-zinc-500 mt-1">Completed your first architectural analysis via URL.</p>
                   </div>
                </div>
                
                <div className="flex gap-4 opacity-50 grayscale">
                   <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center text-zinc-400 shrink-0">
                      <Cpu className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="text-sm font-medium text-primary">Backend Master</h4>
                      <p className="text-xs text-zinc-500 mt-1">Complete 10 analyses focused on Database schemas.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Needed imported icons that were missing
import { Search, Cpu } from "lucide-react";
