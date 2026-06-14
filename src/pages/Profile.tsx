import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Briefcase, FileCode2, History, TrendingUp, Mail, Lock, User as UserIcon, Loader2, LogOut, ArrowRight, Shield } from "lucide-react";
import { api, User, Report } from "../lib/api";

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(api.getUser());
  const [reports, setReports] = useState<Report[]>([]);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingReports, setIsFetchingReports] = useState(false);

  useEffect(() => {
    // Check session on mount
    api.getMe().then((res) => {
      setUser(res);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setIsFetchingReports(true);
      api.getReports()
        .then((res) => {
          setReports(res);
        })
        .catch((err) => {
          console.error("Failed to load reports:", err);
        })
        .finally(() => {
          setIsFetchingReports(false);
        });
    }
  }, [user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (authMode === "login") {
        const loggedInUser = await api.login(email, password);
        setUser(loggedInUser);
        // Dispatch custom event to let layout know auth changed
        window.dispatchEvent(new Event("authChange"));
      } else {
        const registeredUser = await api.register(email, password, name);
        setUser(registeredUser);
        window.dispatchEvent(new Event("authChange"));
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    api.clearSession();
    setUser(null);
    setReports([]);
    window.dispatchEvent(new Event("authChange"));
  };

  const handleLoadReport = (report: Report) => {
    api.setActiveReport(report);
    navigate("/dashboard");
  };

  // Calculate stats
  const totalAnalyses = reports.length;
  const webCount = reports.filter(r => r.inputType === 'url').length;
  const imageCount = reports.filter(r => r.inputType === 'image').length;
  const descCount = reports.filter(r => r.inputType === 'desc').length;
  const masteryLevel = Math.max(1, Math.min(20, Math.floor(totalAnalyses * 1.5) + 1));

  // Determine achievement locks
  const hasFirstDiscovery = totalAnalyses > 0;
  const hasMultimodalPro = imageCount > 0;
  const hasDescExplorer = descCount > 0;
  const hasSuperUser = totalAnalyses >= 5;

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md glass rounded-2xl overflow-hidden shadow-2xl relative z-10">
          <div className="p-8 border-b border-border bg-[#090909] text-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold font-display text-primary">Student Workstation</h2>
            <p className="text-zinc-400 text-xs mt-1">Sign in to save reports, view roadmaps, and track learning progress.</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Mode Switcher */}
            <div className="flex bg-[#111] p-1 rounded-lg border border-[#222]">
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setError(""); }}
                className={`flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${authMode === "login" ? "bg-zinc-800 text-white" : "text-gray-500 hover:text-white"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("register"); setError(""); }}
                className={`flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${authMode === "register" ? "bg-zinc-800 text-white" : "text-gray-500 hover:text-white"}`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "register" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Jane Student"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#111] border border-[#222] rounded-md py-2.5 pl-9 pr-3 text-xs focus:border-blue-500 outline-none text-white transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] rounded-md py-2.5 pl-9 pr-3 text-xs focus:border-blue-500 outline-none text-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] rounded-md py-2.5 pl-9 pr-3 text-xs focus:border-blue-500 outline-none text-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded text-xs font-bold uppercase transition-colors hover:bg-gray-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  authMode === "login" ? "Sign In" : "Register Workspace"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none" />
        
        <div className="w-24 h-24 rounded-full bg-indigo-500/10 border-4 border-zinc-900 shadow-xl flex items-center justify-center relative shrink-0">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
          <span className="text-3xl font-display font-bold text-indigo-400 relative z-10">
            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1 text-center md:text-left relative">
          <h1 className="text-2xl font-bold text-primary mb-1">{user.name}</h1>
          <p className="text-zinc-400 text-sm mb-4">{user.email} • Learner Station</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <History className="w-4 h-4 text-zinc-500" />
              <span className="font-semibold text-primary">{totalAnalyses}</span> Analyses
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-primary">Lvl {masteryLevel}</span> Mastery
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg font-medium transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" /> Sign Out
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
            
            {isFetchingReports ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                <span className="text-xs">Fetching report history...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-lg">
                <FileCode2 className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-zinc-400">Library is empty</p>
                <p className="text-xs text-zinc-600 mt-1 mb-6">Perform an analysis using URL, screenshot, or text description.</p>
                <button
                  onClick={() => navigate("/analyze")}
                  className="px-4 py-2 bg-white text-black text-xs font-bold uppercase rounded-lg hover:bg-gray-200"
                >
                  Analyze Something
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => handleLoadReport(report)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/30 border border-[#222] hover:border-zinc-700 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-950 rounded-md border border-zinc-800 flex items-center justify-center">
                        <FileCode2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-primary group-hover:text-blue-400 transition-colors">{report.title}</h4>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">
                          {report.inputType === 'url' ? report.domain : report.inputType === 'image' ? 'Screenshot upload' : 'Plain-text spec'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {report.isShared && (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Shared
                        </span>
                      )}
                      <span className="text-xs text-zinc-500 font-mono hidden sm:inline">{new Date(report.createdAt).toLocaleDateString()}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Learning Progress */}
          <div className="bg-card border border-border rounded-xl p-6">
             <h2 className="text-lg font-semibold text-primary mb-6">Mastery & Progress</h2>
             
             <div className="space-y-5">
               <div>
                 <div className="flex justify-between text-sm mb-1.5">
                   <span className="text-zinc-300">Frontend frameworks</span>
                   <span className="text-zinc-400 font-mono">{Math.min(100, Math.floor(webCount * 25))}%</span>
                 </div>
                 <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min(100, Math.floor(webCount * 25))}%` }} />
                 </div>
               </div>
               
               <div>
                 <div className="flex justify-between text-sm mb-1.5">
                   <span className="text-zinc-300">API integrations</span>
                   <span className="text-zinc-400 font-mono">{Math.min(100, Math.floor(descCount * 25))}%</span>
                 </div>
                 <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-pink-500 rounded-full transition-all" style={{ width: `${Math.min(100, Math.floor(descCount * 25))}%` }} />
                 </div>
               </div>
               
               <div>
                 <div className="flex justify-between text-sm mb-1.5">
                   <span className="text-zinc-300">Systems design & DB</span>
                   <span className="text-zinc-400 font-mono">{Math.min(100, Math.floor(totalAnalyses * 15))}%</span>
                 </div>
                 <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, Math.floor(totalAnalyses * 15))}%` }} />
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
                {/* 1 */}
                <div className={`flex gap-4 transition-opacity ${hasFirstDiscovery ? '' : 'opacity-40 grayscale'}`}>
                   <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-amber-500 shrink-0">
                      <Award className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="text-sm font-medium text-primary">First Discovery</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Completed your first architectural analysis.</p>
                   </div>
                </div>
                
                {/* 2 */}
                <div className={`flex gap-4 transition-opacity ${hasMultimodalPro ? '' : 'opacity-40 grayscale'}`}>
                   <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-blue-400 shrink-0">
                      <Award className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="text-sm font-medium text-primary">Visual Eye</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Analyzed a system layout from an uploaded screenshot.</p>
                   </div>
                </div>

                {/* 3 */}
                <div className={`flex gap-4 transition-opacity ${hasDescExplorer ? '' : 'opacity-40 grayscale'}`}>
                   <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center text-purple-400 shrink-0">
                      <Award className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="text-sm font-medium text-primary">Synthesizer</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Analyzed a project from a written text description.</p>
                   </div>
                </div>

                {/* 4 */}
                <div className={`flex gap-4 transition-opacity ${hasSuperUser ? '' : 'opacity-40 grayscale'}`}>
                   <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-emerald-400 shrink-0">
                      <Award className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="text-sm font-medium text-primary">Deep Architect</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Saved 5 or more unique scans to your libraries.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
