import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link2, Image as ImageIcon, Sparkles, UploadCloud, ArrowRight, Loader2, Link } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnalyzeInput() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"url" | "image" | "desc">("url");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight text-primary mb-2">
          New Analysis
        </h1>
        <p className="text-zinc-400">
          Submit a URL, upload a screenshot, or describe an app to uncover its architecture.
        </p>
      </div>

      <div className="glass rounded-xl overflow-hidden mt-6">
        {/* Tabs */}
        <div className="flex border-b border-[#262626] bg-[#090909]">
          {[
            { id: "url", label: "Website URL", icon: <Link2 className="w-4 h-4" /> },
            { id: "image", label: "Screenshot", icon: <ImageIcon className="w-4 h-4" /> },
            { id: "desc", label: "Description", icon: <Sparkles className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-[3px]",
                activeTab === tab.id 
                  ? "border-blue-500 text-white" 
                  : "border-transparent text-gray-500 hover:text-white"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <div className="p-8">
          <form onSubmit={handleAnalyze} className="space-y-6">
            {activeTab === "url" && (
              <div className="space-y-2 relative">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Target Application URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    required
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] rounded-md py-3 pl-10 pr-3 text-sm focus:border-blue-500 outline-none text-white transition-colors"
                  />
                  <div className="absolute right-3 top-3.5 text-gray-500 text-xs">&#8984;K</div>
                </div>
              </div>
            )}

            {activeTab === "image" && (
              <div className="border border-[#222] bg-[#111] rounded-md p-12 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors cursor-pointer" onClick={() => setInputValue("image_uploaded")}>
                <div className="w-12 h-12 bg-[#161616] rounded-full flex items-center justify-center mb-4 text-gray-500 border border-[#262626]">
                   <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-white mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
              </div>
            )}

            {activeTab === "desc" && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Product Description</label>
                <textarea
                  placeholder="Describe the application you want to build (e.g., A task management app with real-time collaboration...)"
                  required
                  rows={4}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] rounded-md p-3 text-sm focus:border-blue-500 outline-none text-white transition-colors resize-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={!inputValue || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded text-xs font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  Analyze Target
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Recent section */}
      <div className="mt-16">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Recent Analyses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             { name: "Linear App", domain: "linear.app", stack: "Next.js, Tailwind, GraphQL" },
             { name: "Vercel Platform", domain: "vercel.com", stack: "Next.js, Serverless" }
           ].map((item, i) => (
             <div key={i} className="p-4 bg-[#161616] border border-[#262626] rounded-lg group cursor-pointer hover:bg-[#111] transition-colors flex items-start justify-between">
                <div>
                   <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                     {item.name}
                   </h4>
                   <p className="text-xs text-gray-500 mt-2">{item.domain}</p>
                   <p className="text-[10px] font-mono text-gray-400 mt-2 uppercase tracking-wider">{item.stack}</p>
                </div>
                <div className="w-6 h-6 rounded bg-[#222] border border-[#333] flex items-center justify-center text-gray-500 group-hover:text-blue-500 group-hover:border-blue-500/50 transition-colors">
                   <ArrowRight className="w-3 h-3" />
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
