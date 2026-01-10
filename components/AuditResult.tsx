
import React, { useState } from 'react';
import { AuditResponse, Severity, IssueType, AuditIssue } from '../types';

interface AuditResultProps {
  data: AuditResponse;
  onRequestHelp: () => void;
}

const AuditResult: React.FC<AuditResultProps> = ({ data, onRequestHelp }) => {
  const [devMode, setDevMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedIssues, setExpandedIssues] = useState<string[]>([]);

  const toggleIssue = (id: string) => {
    setExpandedIssues(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-amber-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            {data.issues.length === 0 ? (
              <div className="py-12 text-center">
                <i className="fas fa-check-circle text-5xl text-emerald-500 mb-4"></i>
                <h3 className="text-xl font-bold text-slate-900">Perfect Health!</h3>
                <p className="text-slate-500">We didn't find any major issues on this page.</p>
              </div>
            ) : (
              data.issues.map((issue) => (
                <div key={issue.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                  <button 
                    onClick={() => toggleIssue(issue.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                        issue.severity === Severity.P0 ? 'bg-red-100 text-red-600' : 
                        issue.severity === Severity.P1 ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {issue.severity}
                      </span>
                      <span className="font-bold text-slate-800">{issue.title}</span>
                    </div>
                    <i className={`fas fa-chevron-down transition-transform ${expandedIssues.includes(issue.id) ? 'rotate-180' : ''} text-slate-400`}></i>
                  </button>
                  {expandedIssues.includes(issue.id) && (
                    <div className="p-5 pt-0 bg-white border-t border-slate-100 space-y-4 text-sm">
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                        <h4 className="font-bold text-blue-900 mb-1">Why it matters</h4>
                        <p className="text-blue-800/80 leading-relaxed">{issue.whyItMatters}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <h4 className="font-bold text-slate-900 mb-1">How to fix</h4>
                        <p className="text-slate-600">{issue.howToFix}</p>
                        {issue.exampleSnippet && (
                           <pre className="mt-3 bg-slate-900 text-slate-300 p-3 rounded-lg text-[11px] overflow-x-auto">
                             {issue.exampleSnippet}
                           </pre>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        );
      case 'seo-tags':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Google Title Tag</h4>
                <p className="text-slate-800 font-medium break-words">{data.extracted.title || 'Not detected'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Image Alt Tags</h4>
                <div className="flex items-center gap-3">
                   <p className={`text-sm font-bold ${data.extracted.missingAltCount && data.extracted.missingAltCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                     {data.extracted.missingAltCount && data.extracted.missingAltCount > 0 
                       ? `${data.extracted.missingAltCount} missing` 
                       : 'All present'}
                   </p>
                   <span className="text-xs text-slate-400">(Total: {data.extracted.imageAltCount || 0})</span>
                </div>
              </div>
              <div className="col-span-full p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Meta Description (Snippet)</h4>
                <p className="text-slate-800 font-medium leading-relaxed">{data.extracted.description || 'Not detected'}</p>
              </div>
            </div>
          </div>
        );
      case 'local-seo':
        const localData = data.extracted.jsonld?.find(i => i["@type"] === "LocalBusiness") || {};
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                 <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${data.issues.some(i => i.id === 'missing-gbp') ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                   <i className="fas fa-store"></i>
                 </div>
                 <h4 className="font-bold text-slate-900">Google Business</h4>
                 <p className="text-xs text-slate-500 mt-1">{data.issues.some(i => i.id === 'missing-gbp') ? 'Not Verified' : 'Found & Verified'}</p>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                 <div className="w-12 h-12 rounded-full mx-auto mb-3 bg-amber-100 text-amber-600 flex items-center justify-center">
                   <i className="fas fa-star"></i>
                 </div>
                 <h4 className="font-bold text-slate-900">Map Rating</h4>
                 <p className="text-xs text-slate-500 mt-1">{localData.rating ? `${localData.rating} Stars` : 'No data'}</p>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                 <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${data.issues.some(i => i.id === 'no-local-pack') ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                   <i className="fas fa-map-marked-alt"></i>
                 </div>
                 <h4 className="font-bold text-slate-900">Local Pack</h4>
                 <p className="text-xs text-slate-500 mt-1">{data.issues.some(i => i.id === 'no-local-pack') ? 'Not Ranking' : 'Ranking in Top 3'}</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full"></div>
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Maps Preview</h4>
              <div className="flex gap-4">
                <div className="flex-1">
                   <h5 className="text-lg font-bold">{data.extracted.title}</h5>
                   <div className="flex items-center gap-1 text-amber-400 text-sm my-1">
                     {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i >= Math.floor(localData.rating || 0) ? 'text-slate-700' : ''}`}></i>)}
                     <span className="text-slate-400 text-xs ml-1">({localData.reviewCount || 0} Reviews)</span>
                   </div>
                   <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                     <i className="fas fa-map-marker-alt text-blue-500"></i> Local Service Presence Detected
                   </p>
                </div>
                <div className="w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-map text-3xl text-slate-700"></i>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Summary */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                <circle
                  cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - data.score / 100)}
                  className={`${getScoreColor(data.score)} transition-all duration-1000 ease-out`}
                />
              </svg>
              <span className={`absolute text-2xl font-bold ${getScoreColor(data.score)}`}>{data.score}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Health Score: {data.grade}</h1>
              <p className="text-slate-500 truncate max-w-md">Report for: {data.url}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Critical</p>
              <p className="text-2xl font-bold text-red-700">{data.counts.P0}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">High</p>
              <p className="text-2xl font-bold text-amber-700">{data.counts.P1}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Technical</p>
              <p className="text-2xl font-bold text-blue-700">{data.counts.technical}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Alt Tags</p>
              <p className="text-2xl font-bold text-emerald-700">{data.extracted.missingAltCount === 0 ? 'Good' : 'Fix'}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <button onClick={onRequestHelp} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
              Fix My Site
            </button>
            <div className="flex items-center justify-between text-sm text-slate-500 px-1">
              <span>Developer Mode</span>
              <button onClick={() => setDevMode(!devMode)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${devMode ? 'bg-blue-600' : 'bg-slate-200'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${devMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
            <div className="flex border-b border-slate-100 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {[
                {id: 'overview', label: 'Overview'},
                {id: 'local-seo', label: 'Local & GMB'},
                {id: 'seo-tags', label: 'SEO & Alt Tags'}
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-semibold capitalize transition-all border-b-2 ${
                    activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Google Preview</h3>
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1">
                   <p className="text-xs text-slate-500 truncate">{data.url}</p>
                </div>
                <h4 className="text-xl text-blue-700 font-medium hover:underline cursor-pointer leading-tight">
                  {data.extracted.title}
                </h4>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {data.extracted.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <h3 className="text-2xl font-bold mb-4">Ready for Growth?</h3>
            <p className="text-blue-100 mb-6 leading-relaxed text-sm">
              We fix the technical barriers stopping you from ranking.
            </p>
            <ul className="space-y-3 mb-8 text-xs text-blue-100/80">
              <li className="flex items-center gap-2"><i className="fas fa-check-circle text-blue-400"></i> Alt Tag Optimization</li>
              <li className="flex items-center gap-2"><i className="fas fa-check-circle text-blue-400"></i> GMB Profile Verification</li>
              <li className="flex items-center gap-2"><i className="fas fa-check-circle text-blue-400"></i> Meta-tag Cleanup</li>
            </ul>
            <button onClick={onRequestHelp} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg border border-blue-500">
              Get Help from Mapmyspot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditResult;
