import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Code2, 
  Cpu, 
  Lightbulb, 
  Map, 
  Search, 
  UserCircle 
} from "lucide-react";

export function RootLayout() {
  const location = useLocation();

  const navItems = [
    { name: "New Analysis", path: "/analyze", icon: <Search className="w-4 h-4" /> },
    { name: "Dashboard", path: "/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    { name: "Architecture", path: "/architecture", icon: <Cpu className="w-4 h-4" /> },
    { name: "Learning Roadmap", path: "/roadmap", icon: <Map className="w-4 h-4" /> },
    { name: "Recommendations", path: "/recommendations", icon: <Lightbulb className="w-4 h-4" /> },
    { name: "Profile", path: "/profile", icon: <UserCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top Header (from design) */}
      <header className="h-14 flex items-center justify-between px-6 border-b-thin bg-[#090909] shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-black rotate-45"></div>
            </div>
            <span className="font-semibold tracking-tight text-lg uppercase text-primary">CodeLens <span className="text-blue-500">AI</span></span>
          </Link>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <Link to="/analyze" className="hover:text-white transition-colors">Analysis</Link>
          <Link to="/roadmap" className="hover:text-white transition-colors">Roadmaps</Link>
          <Link to="/architecture" className="hover:text-white transition-colors">Library</Link>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right mr-2">
            <p className="text-xs font-semibold text-primary">Jane Student</p>
            <p className="text-[10px] text-gray-500">PRO PLAN</p>
          </div>
          <Link to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 border border-[#444]"></Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r-thin bg-[#090909] flex flex-col p-4 hidden md:flex">
          <div className="relative mb-6">
            <input type="text" placeholder="Analyze URL..." className="w-full bg-[#111] border border-[#222] rounded-md py-2 px-3 text-xs focus:border-blue-500 outline-none text-primary" />
            <div className="absolute right-3 top-2.5 text-gray-500 text-xs">&#8984;K</div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">
              Explorer
            </div>
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded text-xs font-medium transition-colors group cursor-pointer",
                    isActive 
                      ? "bg-[#161616] border border-[#262626] text-primary" 
                      : "text-gray-400 hover:text-white hover:bg-[#111] border border-transparent"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}
          </div>
          
          <div className="mt-auto p-4 bg-[#111] border border-[#222] rounded-lg">
            <p className="text-[11px] font-semibold mb-1 text-primary">New Insight Available</p>
            <p className="text-[10px] text-gray-400 mb-3">Compare your last 3 scans to find common design patterns.</p>
            <button className="w-full py-1.5 bg-white text-black text-[10px] font-bold rounded uppercase hover:bg-gray-200 transition-colors">View Insights</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
