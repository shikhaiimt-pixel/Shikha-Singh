
import React, { useState, useEffect } from 'react';
import { AuditResponse, IssueItem, Severity, ActionItem } from '../types';

interface AuditResultProps {
  data: AuditResponse;
  onRequestHelp: (customMessage?: string) => void;
}

const AuditResult: React.FC<AuditResultProps> = ({ data, onRequestHelp }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedIssues, setExpandedIssues] = useState<string[]>([]);
  const [gbpLinkInput, setGbpLinkInput] = useState('');
  const [localData, setLocalData] = useState(data.local);

  useEffect(() => {
    if (data.local) {
      setLocalData(data.local);
    }
  }, [data.local]);

  // Auto-expand first few issues if they exist
  useEffect(() => {
    if (data.overview?.priorityFixes?.length > 0 && expandedIssues.length === 0) {
      setExpandedIssues([data.overview.priorityFixes[0].id]);
    }
  }, [data.overview?.priorityFixes]);

  const toggleIssue = (id: string) => {
    setExpandedIssues(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleGbpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isGoogleMaps = /google\.com\/maps|g\.page|maps\.app\.goo\.gl/.test(gbpLinkInput);
    if (isGoogleMaps) {
      setLocalData(prev => ({
        ...prev,
        mapsStatus: 'provided',
        providedGbpUrl: gbpLinkInput
      }));
    } else {
      alert("Please enter a valid Google Maps or Business Profile link.");
    }
  };

  const getSeverityBadge = (sev: Severity) => {
    switch(sev) {
      case 'Critical': return 'bg-red-100 text-red-600 border-red-200';
      case 'Warning': return 'bg-amber-100 text-amber-600 border-amber-200';
      default: return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };

  const renderActionCard = (action: ActionItem) => (
    <div key={action.title} className="bg-white border border-slate-200 p-5 rounded-2xl mb-4 flex items-start gap-4 hover:shadow-md transition-all">
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${action.impact === 'High' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
         <i className="fas fa-bolt text-sm"></i>
       </div>
       <div className="flex-1">
         <div className="flex justify-between items-start mb-1">
           <h4 className="font-bold text-slate-800">{action.title}</h4>
           <span className="text-[10px] font-black uppercase text-slate-400">Impact: {action.impact}</span>
         </div>
         <p className="text-xs text-slate-500 mb-3">{action.steps?.[0]}</p>
         <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
           <span className="text-blue-600">Difficulty: {action.difficulty}</span>
           <span className="text-slate-400">{action.type}</span>
         </div>
       </div>
    </div>
  );

  const renderLocal = () => {
    if (!localData) return null;
    const sigs = localData.websiteSignals;
    
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm flex flex-col justify-center text-center">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">GBP on Google Maps</h5>
            <div className={`text-sm font-bold flex items-center justify-center gap-2 ${localData.mapsStatus === 'provided' ? 'text-emerald-600' : 'text-slate-400'}`}>
              <i className={`fas ${localData.mapsStatus === 'provided' ? 'fa-check-circle' : 'fa-question-circle'}`}></i>
              {localData.mapsStatus === 'provided' ? 'Provided by user' : 'Unknown Status'}
            </div>
            {localData.mapsStatus === 'unknown' && <p className="text-[9px] text-slate-400 mt-2">Requires manual lookup</p>}
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm flex flex-col justify-center text-center">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">GBP link on website</h5>
            <div className={`text-sm font-bold flex items-center justify-center gap-2 ${sigs?.gbpLinkFound ? 'text-blue-600' : 'text-slate-400'}`}>
              <i className={`fas ${sigs?.gbpLinkFound ? 'fa-link' : 'fa-unlink'}`}></i>
              {sigs?.gbpLinkFound ? 'Found' : 'Not Found'}
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm flex flex-col justify-center text-center">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Local Readiness Score</h5>
            <div className="text-2xl font-black text-slate-900">{localData.localReadinessScore || 0}%</div>
          </div>
        </div>

        {localData.mapsStatus === 'unknown' && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-[2rem]">
            <h4 className="font-bold text-slate-800 mb-2">Confirm Your Maps Presence</h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Google Maps verification requires a reliable link. Mapmyspot can check your website signals, but we can't verify your live profile without a link.
            </p>
            <form onSubmit={handleGbpSubmit} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Paste your Google Maps / Business Profile link..." 
                value={gbpLinkInput}
                onChange={(e) => setGbpLinkInput(e.target.value)}
                className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-600"
              />
              <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Verify Link</button>
            </form>
          </div>
        )}

        {localData.mapsStatus === 'provided' && (
           <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center justify-between">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex-shrink-0 flex items-center justify-center text-white"><i className="fas fa-check"></i></div>
                <div className="min-w-0">
                  <h5 className="text-sm font-bold text-emerald-900">GBP Link Provided</h5>
                  <p className="text-xs text-emerald-700 truncate">{localData.providedGbpUrl}</p>
                </div>
              </div>
              <button onClick={() => setLocalData(prev => ({...prev, mapsStatus: 'unknown', providedGbpUrl: null}))} className="text-[10px] font-black text-emerald-600 uppercase flex-shrink-0 ml-4">Remove</button>
           </div>
        )}

        <section>
          <div className="flex justify-between items-end mb-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Website Signals Audit</h4>
            <span className="text-[10px] text-slate-400 italic">Checks performed on website code only</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'NAP Patterns', val: sigs?.napFound },
              { label: 'Address Text', val: sigs?.addressFound },
              { label: 'tel: Phone Link', val: sigs?.telLinkFound },
              { label: 'Local Keywords', val: sigs?.localKeywordsFound },
              { label: 'Maps Embed', val: sigs?.mapsEmbedFound },
              { label: 'Local Schema', val: sigs?.schemaLocalBusinessFound },
              { label: 'Reviews Content', val: sigs?.reviewsSectionFound },
              { label: 'GBP Website Link', val: sigs?.gbpLinkFound },
            ].map(sig => (
              <div key={sig.label} className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${sig.val ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-300'}`}>
                  <i className={`fas ${sig.val ? 'fa-check' : 'fa-times'}`}></i>
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter leading-none">{sig.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <i className="fas fa-map-marked-alt text-9xl"></i>
           </div>
           <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-black mb-2">Verify and Fix Your Listing?</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Mapmyspot can verify your profile on Google Maps, fix incorrect categories, and help you dominate the Local 3-Pack.
                </p>
              </div>
              <button onClick={() => onRequestHelp("I need help with my Google Business Profile and Local SEO visibility.")} className="whitespace-nowrap bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg hover:bg-blue-700 active:scale-95 transition-all">Get Professional Help</button>
           </div>
        </div>

        <section>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Local Action Plan</h4>
          <div className="space-y-4">
            {localData.recommendations?.length > 0 ? (
              localData.recommendations.map(renderActionCard)
            ) : (
              <div className="space-y-4">
                {renderActionCard({
                  title: "Add LocalBusiness Schema Markup",
                  impact: "High",
                  type: "Technical",
                  difficulty: "Hard",
                  steps: ["Add JSON-LD LocalBusiness schema to your footer with your exact address and phone number."]
                })}
                {renderActionCard({
                  title: "Include Service + City in Heading Tags",
                  impact: "High",
                  type: "On-Page",
                  difficulty: "Easy",
                  steps: ["Ensure your H1 includes both your primary service and location (e.g. 'Expert Dental Care in Austin')."]
                })}
                {renderActionCard({
                  title: "Add a Google Map Embed",
                  impact: "Medium",
                  type: "Trust Signal",
                  difficulty: "Easy",
                  steps: ["Embed a map on your Contact page to confirm your physical presence to Google's crawlers."]
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  const renderIssueCardFull = (issue: IssueItem) => {
    const isExpanded = expandedIssues.includes(issue.id);
    return (
      <div key={issue.id} className="border border-slate-200 rounded-3xl overflow-hidden bg-white mb-6 shadow-sm hover:border-slate-300 transition-colors">
        <button 
          onClick={() => toggleIssue(issue.id)} 
          className="w-full flex items-center justify-between p-6 text-left group"
        >
          <div className="flex items-center gap-5">
            <span className={`px-3 py-1 border rounded-lg text-[10px] font-black uppercase tracking-widest ${getSeverityBadge(issue.severity)}`}>
              {issue.severity || 'Update'}
            </span>
            <div>
              <span className="font-black text-slate-900 text-lg block leading-none mb-1 group-hover:text-blue-600 transition-colors">
                {issue.title || "Optimization Found"}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">
                {issue.type || "Technical SEO"} • Est. {issue.estTime || "15 mins"}
              </span>
            </div>
          </div>
          <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <i className={`fas fa-chevron-down text-slate-400 group-hover:text-blue-600 transition-all ${isExpanded ? 'rotate-180' : ''}`}></i>
          </div>
        </button>
        {isExpanded && (
          <div className="p-8 pt-2 bg-white border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">What We Found</h4>
                <div className="text-sm text-slate-600 leading-relaxed font-medium">
                  {issue.whatWeFound || "Our crawler identified an opportunity to improve this technical marker."}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Why It Matters</h4>
                  <div className="text-xs text-slate-500 italic leading-relaxed">
                    {issue.whyItMatters || "Improving this helps Google understand and trust your business data more effectively."}
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">How To Fix</h4>
                <ul className="space-y-3">
                  {issue.howToFix && issue.howToFix.length > 0 ? (
                    issue.howToFix.map((step, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-3 group">
                        <span className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black mt-0.5 group-hover:bg-emerald-100 transition-colors">{i + 1}</span>
                        <span className="font-medium">{step}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500 italic">Review documentation for fixes.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Header Summary */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 p-10 mb-10 overflow-hidden relative">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4 flex items-center gap-8 border-r border-slate-100 pr-10">
            <div className="relative w-32 h-32 flex-shrink-0">
               <svg className="w-full h-full -rotate-90">
                 <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                 <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent"
                   strokeDasharray={2 * Math.PI * 56}
                   strokeDashoffset={2 * Math.PI * 56 * (1 - (data.score || 0) / 100)}
                   className={`${data.score >= 90 ? 'text-emerald-500' : data.score >= 70 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000`}
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-black text-slate-900">{data.score || 0}</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
               </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-1 leading-tight">{data.grade}</h1>
              <p className="text-slate-500 text-sm truncate max-w-[200px] font-medium">{data.url}</p>
            </div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-3 gap-6">
            <div className="text-center"><p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Critical</p><p className="text-3xl font-black text-slate-900">{data.counts?.critical || 0}</p></div>
            <div className="text-center"><p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Warnings</p><p className="text-3xl font-black text-slate-900">{data.counts?.warnings || 0}</p></div>
            <div className="text-center"><p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Growth</p><p className="text-3xl font-black text-slate-900">{data.counts?.growthOpps || 0}</p></div>
          </div>
          <div className="lg:col-span-3">
             <button onClick={() => onRequestHelp()} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all">Fix My Site Now</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
         <div className="flex border-b border-slate-100 px-6 gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
           {['overview', 'local & gmb', 'speed & performance', 'social previews'].map(tab => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`py-6 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{tab}</button>
           ))}
         </div>
         <div className="p-10 min-h-[400px]">
           {activeTab === 'overview' && (
             <div className="space-y-10">
               <section>
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3"><i className="fas fa-list-check text-blue-600"></i> Priority Fixes</h3>
                  <div className="space-y-2">
                    {data.overview?.priorityFixes && data.overview.priorityFixes.length > 0 ? (
                      data.overview.priorityFixes.map(renderIssueCardFull)
                    ) : (
                      <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-check-double text-2xl"></i>
                        </div>
                        <h4 className="text-lg font-black text-slate-900">No Critical Issues!</h4>
                        <p className="text-slate-500 font-medium">Your basic technical foundation looks solid.</p>
                      </div>
                    )}
                  </div>
               </section>
               <div className="bg-blue-600 p-10 rounded-[3rem] shadow-xl shadow-blue-100 text-white">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-6 opacity-80">Executive Summary</h4>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {data.overview?.summaryBullets?.map((s, i) => (
                      <li key={i} className="text-sm font-bold flex items-start gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                        <i className="fas fa-check-circle text-blue-200 mt-1"></i> 
                        {s}
                      </li>
                    ))}
                  </ul>
               </div>
             </div>
           )}
           {activeTab === 'local & gmb' && renderLocal()}
           {activeTab === 'speed & performance' && (
              <div className="space-y-8">
                 <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] flex flex-wrap gap-12 justify-center shadow-xl">
                    <div className="text-center">
                      <span className="text-[10px] font-black uppercase opacity-60">Estimated Load</span>
                      <p className="text-4xl font-black">{data.speed?.metrics?.loadTimeMs || '?'}<span className="text-sm opacity-50 ml-1">ms</span></p>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-black uppercase opacity-60">Mobile Score</span>
                      <p className="text-4xl font-black">{data.speed?.metrics?.mobileFriendly ? '100%' : 'N/A'}</p>
                    </div>
                 </div>
                 <section>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Performance Insights</h4>
                    {data.speed?.tips?.length > 0 ? data.speed.tips.map(renderActionCard) : <div className="text-slate-400 italic">No specific performance tips available.</div>}
                 </section>
              </div>
           )}
           {activeTab === 'social previews' && (
             <div className="space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Google Search Card</h4>
                      <div className="bg-white p-4 rounded-xl shadow-sm space-y-1">
                         <p className="text-[10px] text-slate-400 truncate">{data.social?.previews?.google?.displayUrl || data.url}</p>
                         <h5 className="text-lg text-[#1a0dab] font-medium hover:underline cursor-pointer">{data.social?.previews?.google?.title || 'No Title Detected'}</h5>
                         <p className="text-xs text-[#4d5156] line-clamp-2">{data.social?.previews?.google?.description || 'No description detected.'}</p>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Facebook Preview</h4>
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                         <div className="h-32 bg-slate-200 flex items-center justify-center">
                            {data.social?.previews?.facebook?.imageUrl ? <img src={data.social.previews.facebook.imageUrl} className="w-full h-full object-cover" /> : <i className="fas fa-image text-slate-300 text-3xl"></i>}
                         </div>
                         <div className="p-3 bg-slate-100 border-t border-slate-200">
                            <p className="text-[10px] text-slate-400 uppercase font-black">{new URL(data.url).hostname}</p>
                            <h5 className="text-sm font-bold text-slate-900 truncate">{data.social?.previews?.facebook?.title || 'Social Title Missing'}</h5>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}
         </div>
      </div>
    </div>
  );
};

export default AuditResult;
