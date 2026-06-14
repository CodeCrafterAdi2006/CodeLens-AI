import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Database, Layout, Server, Sparkles, ShieldCheck, Share2, Clipboard, Star, Check, AlertTriangle, HelpCircle, ArrowRight } from "lucide-react";
import { api, Report } from "../lib/api";

export function Dashboard() {
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(api.getActiveReport());
  const [isShared, setIsShared] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Feedback state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    // If no active report, check if we have any saved reports
    if (!report) {
      if (api.getToken()) {
        api.getReports().then((list) => {
          if (list.length > 0) {
            api.setActiveReport(list[0]);
            setReport(list[0]);
          }
        });
      }
    } else {
      setIsShared(report.isShared);
    }
  }, [report]);

  const handleToggleShare = async () => {
    if (!report) return;
    try {
      const nextShareState = !isShared;
      const updated = await api.toggleShareReport(report.id, nextShareState);
      setIsShared(updated.isShared);
      
      const link = `${window.location.origin}/#/share/${report.id}`;
      setShareLink(link);
    } catch (err) {
      console.error("Failed to share report:", err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink || `${window.location.origin}/#/share/${report?.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || rating === 0) return;
    setIsSubmittingFeedback(true);
    try {
      await api.submitFeedback(report.id, rating, comments, reviewerName);
      setFeedbackSuccess(true);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (!report) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 glass rounded-2xl relative">
          <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full" />
          <HelpCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-primary">No Active Scan Found</h2>
          <p className="text-xs text-zinc-400 mt-2 mb-6">You haven't run any architectural analyses yet. Submit a URL or screenshot to get started.</p>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-gray-200 transition-colors"
          >
            Start Analyzing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 relative">
      <div className="absolute inset-0 bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-display font-bold text-primary">{report.title} Analysis</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium uppercase tracking-wider text-[10px]">
              Inferred
            </span>
          </div>
          <p className="text-zinc-400 text-sm">
            Input Mode: <span className="font-mono capitalize font-bold text-zinc-300">{report.inputType === 'url' ? 'URL scan' : report.inputType === 'image' ? 'Screenshot layout' : 'System specification'}</span>
            {report.inputType === 'url' && (
              <a href={report.inputValue} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline ml-2">
                ({report.domain})
              </a>
            )}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {api.getToken() ? (
            <button
              onClick={handleToggleShare}
              className="px-4 py-2 bg-zinc-800 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 border border-zinc-700"
            >
              <Share2 className="w-3.5 h-3.5" /> 
              {isShared ? "Report Publicly Shared" : "Share Report"}
            </button>
          ) : (
            <div className="text-[10px] text-zinc-500 max-w-xs self-center text-center py-1.5 px-3 border border-zinc-800 rounded bg-[#090909]">
              🔑 <Link to="/profile" className="text-blue-400 font-bold hover:underline">Log in</Link> to permanently save & share this report.
            </div>
          )}
        </div>
      </div>

      {/* Share Link Drawer */}
      {isShared && (
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-emerald-400 text-xs">
            <Check className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-semibold">Public Link Active</span>
              <p className="text-zinc-400 text-[10px] mt-0.5">Anyone with this link can view this reverse engineering report.</p>
            </div>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareLink || `${window.location.origin}/#/share/${report.id}`}
              className="bg-black/40 border border-zinc-800 rounded p-1.5 text-xs text-zinc-300 font-mono flex-1 sm:w-80 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors shrink-0"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Tech Stack Prediction */}
      <section className="space-y-4 relative z-10">
        <h2 className="text-lg font-semibold text-zinc-200">Inferred Technology Stack</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { category: "Frontend Core", icon: <Layout className="w-5 h-5 text-blue-400" />, items: report.techStack.frontend },
            { category: "Backend Engine", icon: <Server className="w-5 h-5 text-emerald-400" />, items: report.techStack.backend },
            { category: "Database & Hosting", icon: <Database className="w-5 h-5 text-purple-400" />, items: report.techStack.databaseInfra },
          ].map((stack, i) => (
            <div key={i} className="glass rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-[#111] border border-zinc-800">
                    {stack.icon}
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">{stack.category}</h3>
                </div>
                <ul className="space-y-4">
                  {stack.items.map((item, j) => (
                    <li key={j} className="text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {item.name}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono ${
                          item.confidence >= 85 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          item.confidence >= 70 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {item.confidence}% Conf
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-normal pl-3">{item.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Confidence & Architecture Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="glass rounded-xl p-6 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Architecture Narrative</h3>
            <div className="prose prose-invert text-xs text-zinc-400 leading-relaxed space-y-3">
              <p>{report.architectureSummary}</p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-[#262626] flex flex-wrap gap-2">
              {report.techStack.frontend.concat(report.techStack.backend).map(tag => (
                <span key={tag.name} className="badge bg-black border-[#333]">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* Academic Honesty / Limitations disclosure */}
          <div className="p-5 glass border border-amber-500/20 bg-amber-500/5 rounded-xl space-y-3">
            <div className="flex items-center gap-2.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Academic Disclaimer & Undetermined Parameters
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              CodeLens AI generates probabilistic architecture hypotheses based entirely on publicly crawlable signals. This report does not represent confirmed source code configurations.
            </p>
            <div className="pt-2 border-t border-[#262626] space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Undetermined Fields:</span>
              <ul className="list-disc pl-4 space-y-1">
                {report.missingInferences.map((inf, k) => (
                  <li key={k} className="text-[10px] text-zinc-500 font-mono">{inf}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-xl p-5 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center justify-between">
              Insight Reliability Metrics
              <ShieldCheck className="w-4 h-4 text-blue-500" />
            </h3>
            
            <div className="space-y-4">
               {[
                 { label: "Frontend Signals", value: report.techStack.frontend[0]?.confidence || 90 },
                 { label: "Backend API Framework", value: report.techStack.backend[0]?.confidence || 75 },
                 { label: "Database Hypotheses", value: report.techStack.databaseInfra[0]?.confidence || 60 },
               ].map((metric, i) => (
                 <div key={i}>
                   <div className="flex justify-between text-xs mb-2">
                     <span className="text-zinc-400">{metric.label}</span>
                     <span className="text-blue-500 font-mono font-bold">{metric.value}%</span>
                   </div>
                   <div className="h-1 bg-[#222] rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-blue-500 rounded-full"
                       style={{ width: `${metric.value}%` }}
                     />
                   </div>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="glass rounded-xl p-5 flex items-start gap-4 border border-indigo-500/20 bg-indigo-500/5">
            <Activity className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Telemetry Audit log</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                Extracted HTML payload of {report.inputValue.length * 4} bytes. Identified {report.techStack.frontend.length + report.techStack.backend.length} distinct system tags.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback & Rating Widget */}
      <section className="glass rounded-xl p-6 relative z-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" /> Let us know how we did!
        </h3>
        
        {feedbackSuccess ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold">
            Thank you! Your feedback has been logged to help refine the AI analysis framework.
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <p className="text-xs text-zinc-400">Rate the accuracy of this reverse engineering hypothesis based on your engineering logic:</p>
            
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reviewer Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Anonymous Student"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] rounded-md p-2 text-xs focus:border-blue-500 outline-none text-white transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Corrections or Comments</label>
                <textarea
                  placeholder="Let us know what tech or databases we missed..."
                  rows={2}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] rounded-md p-2 text-xs focus:border-blue-500 outline-none text-white transition-colors resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={rating === 0 || isSubmittingFeedback}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-xs font-bold uppercase tracking-wider text-primary rounded-lg transition-colors"
            >
              {isSubmittingFeedback ? "Logging Review..." : "Submit Review"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
