import { Link } from "react-router-dom";
import { ArrowRight, Code2, Layers, LineChart, Sparkles, Terminal } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="h-14 px-6 md:px-12 flex items-center justify-between border-b-thin bg-[#090909] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-black rotate-45"></div>
            </div>
            <span className="font-semibold tracking-tight text-lg uppercase text-primary">CodeLens <span className="text-blue-500">AI</span></span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <Link to="/analyze" className="text-white hover:text-gray-300 transition-colors">Sign in</Link>
          <Link 
            to="/analyze" 
            className="bg-white text-black px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-all border border-transparent"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-24 md:pt-48 md:pb-32 max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded badge mb-8 text-blue-500 border-blue-500/30">
            <Sparkles className="w-4 h-4" />
            <span>CodeLens AI 2.0 is now live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 max-w-3xl leading-tight mb-6">
            Reverse engineer <br className="hidden md:block"/> any application.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed font-light">
            AI-powered educational platform connecting UI/UX to code, architecture, and tech stacks. Learn how your favorite products are built.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/analyze" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Start Analyzing <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#111] hover:bg-[#1a1a1a] border-thin text-white px-8 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors"
            >
              View Example
            </a>
          </div>
          
          {/* Mockup / Abstract Vis */}
          <div className="mt-20 w-full relative group">
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
            <div className="relative glass rounded-xl shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
               <div className="grid grid-cols-3 gap-6 w-3/4 opacity-80 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="h-32 bg-[#111] border-thin rounded flex flex-col items-center justify-center gap-3">
                     <Layers className="w-8 h-8 text-blue-400" />
                     <span className="font-mono text-xs text-gray-400">Frontend View</span>
                  </div>
                  <div className="h-32 bg-[#111] border-thin rounded flex flex-col items-center justify-center gap-3 mt-12">
                     <Terminal className="w-8 h-8 text-purple-400" />
                     <span className="font-mono text-xs text-gray-400">API Layer</span>
                  </div>
                  <div className="h-32 bg-[#111] border-thin rounded flex flex-col items-center justify-center gap-3 mt-24">
                     <LineChart className="w-8 h-8 text-orange-400" />
                     <span className="font-mono text-xs text-gray-400">Database Schema</span>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-xs font-mono text-gray-600 border-t-thin bg-[#090909]">
        <p>&copy; 2026 CodeLens AI. Demo Application.</p>
      </footer>
    </div>
  );
}
