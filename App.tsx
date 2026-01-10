
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import AuditResult from './components/AuditResult';
import { runAudit, submitLead } from './services/auditService';
import { AuditResponse, LeadForm } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const [leadForm, setLeadForm] = useState<LeadForm>({
    name: '',
    email: '',
    website: '',
    businessType: 'Restaurant',
    notes: '',
    emailReport: true
  });

  const handleStartAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput) return;

    setIsAnalyzing(true);
    setAuditData(null);
    setCurrentPage('audit');

    try {
      const result = await runAudit(urlInput);
      setAuditData(result);
      setLeadForm(prev => ({ ...prev, website: result.url }));
    } catch (err) {
      alert('Could not analyze the website. Please check the URL and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);
    try {
      await submitLead({ ...leadForm, auditSummary: auditData ? { score: auditData.score, p0: auditData.counts.P0 } : null });
      setLeadSuccess(true);
    } catch (err) {
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const renderHome = () => (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
              NEW: Free SEO Audit for 2024
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Is your website <span className="text-blue-600">invisible</span> on Google?
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
              Check your SEO and social previews in 60 seconds. We'll show you exactly what to fix to attract more customers.
            </p>
            
            <form onSubmit={handleStartAudit} className="relative max-w-xl group">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter your website (e.g. mycafe.com)"
                className="w-full pl-6 pr-44 py-5 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-lg transition-all shadow-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-8 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                Analyze <i className="fas fa-arrow-right text-xs"></i>
              </button>
            </form>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-blue-500"></i> Google Previews
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-blue-500"></i> Social Cards
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-blue-500"></i> 100% Free
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-10"></div>
            <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-2">
              <img 
                src="https://picsum.photos/id/0/800/600" 
                alt="Audit Dashboard Preview" 
                className="rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-100 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-slate-900">SEO Health Report</span>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Scanned</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%]"></div>
                  </div>
                  <p className="text-xs text-slate-500 text-right font-medium">Score: 85/100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-12">Trusted by Local Businesses</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-black text-slate-800 italic">CafeLocal</span>
            <span className="text-2xl font-black text-slate-800 uppercase">ModernHome</span>
            <span className="text-2xl font-black text-slate-800">PETSHOP</span>
            <span className="text-2xl font-black text-slate-800 lowercase">bistro77</span>
            <span className="hidden lg:block text-2xl font-black text-slate-800">CLEANER_PRO</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="bg-slate-50 min-h-screen">
      {/* Sticky Top URL Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex-1 relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter URL to re-analyze"
            />
          </div>
          <button 
            onClick={() => handleStartAudit()}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-800"
          >
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="max-w-3xl mx-auto py-32 text-center px-4">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-8"></div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Analyzing your website...</h2>
          <div className="space-y-3 max-w-xs mx-auto text-left">
            <p className="text-slate-500 flex items-center gap-3">
              <i className="fas fa-check text-blue-600"></i> Fetching HTML content
            </p>
            <p className="text-slate-500 flex items-center gap-3">
              <i className="fas fa-check text-blue-600"></i> Parsing header meta tags
            </p>
            <p className="text-slate-400 flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin"></div> Calculating SEO score
            </p>
            <p className="text-slate-300 flex items-center gap-3">
              <i className="fas fa-circle text-[8px]"></i> Building search previews
            </p>
          </div>
        </div>
      ) : auditData ? (
        <AuditResult 
          data={auditData} 
          onRequestHelp={() => setCurrentPage('contact')} 
        />
      ) : (
        <div className="py-20 text-center">
           <p className="text-slate-500">Please enter a URL to begin.</p>
        </div>
      )}
    </div>
  );

  const renderContact = () => (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Let Mapmyspot fix your SEO</h2>
          <p className="text-xl text-slate-600 mb-12">
            Most small business owners don't have time to mess with code. We'll handle everything so you can focus on running your business.
          </p>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-bolt text-blue-600 text-xl"></i>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Fast Execution</h4>
                <p className="text-slate-500">Technical fixes implemented within 48 hours.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-dollar-sign text-emerald-600 text-xl"></i>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Fixed Pricing</h4>
                <p className="text-slate-500">No hourly rates. Just simple packages starting at $199.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-chart-line text-indigo-600 text-xl"></i>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Measurable Results</h4>
                <p className="text-slate-500">Better CTR on Google and cleaner shares on social media.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
          {leadSuccess ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check text-4xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Request Sent!</h3>
              <p className="text-slate-500 mb-8">We've received your audit details. One of our experts will review it and reach out within 24 hours.</p>
              <button 
                onClick={() => setLeadSuccess(false)}
                className="text-blue-600 font-bold hover:underline"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                  <input 
                    required
                    type="text" 
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input 
                    required
                    type="email" 
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Website URL</label>
                <input 
                  required
                  type="text" 
                  value={leadForm.website}
                  onChange={(e) => setLeadForm({...leadForm, website: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Business Type</label>
                <select 
                  value={leadForm.businessType}
                  onChange={(e) => setLeadForm({...leadForm, businessType: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option>Restaurant</option>
                  <option>Salon / Spa</option>
                  <option>E-commerce</option>
                  <option>Local Trade (Plumber/Electrician)</option>
                  <option>Professional Service</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes</label>
                <textarea 
                  rows={4}
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({...leadForm, notes: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Tell us about your business goals..."
                ></textarea>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={leadForm.emailReport}
                  onChange={(e) => setLeadForm({...leadForm, emailReport: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded" 
                />
                <label className="text-sm text-slate-600 font-medium">Email me the full report as a PDF</label>
              </div>
              <button 
                type="submit"
                disabled={isSubmittingLead}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-3"
              >
                {isSubmittingLead ? 'Submitting...' : 'Send Request for Help'}
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'home': return renderHome();
      case 'audit': return renderAudit();
      case 'contact': return renderContact();
      case 'how-it-works': return (
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-8">How it Works</h2>
          <div className="space-y-12">
            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</div>
                Real-time Analysis
              </h3>
              <p className="text-slate-600 leading-relaxed">
                When you enter your URL, our engine fetches your website's source code just like Google does. We look at the hidden "metadata" tags that tell search engines and social platforms what your business is about.
              </p>
            </section>
            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</div>
                Scoring Logic
              </h3>
              <p className="text-slate-600 mb-4">We score your site from 0-100 based on industry best practices:</p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="font-bold text-red-600">P0 (Critical):</span> Missing titles, descriptions, or indexing blocks. These prevent you from appearing in search.
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-amber-600">P1 (High):</span> Poorly formatted tags or missing social previews. These hurt your click-through rate.
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-blue-600">P2 (Medium):</span> Small inconsistencies like canonical tag mismatches.
                </li>
              </ul>
            </section>
            <section className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</div>
                Actionable Fixes
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We don't just tell you what's wrong. We provide the exact code snippets and "plain English" explanations so you can fix them yourself, or ask Mapmyspot to do the heavy lifting for you.
              </p>
            </section>
          </div>
        </div>
      );
      case 'services': return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Mapmyspot Services</h2>
          <p className="text-xl text-slate-600 mb-16 max-w-2xl mx-auto">We specialize in helping local businesses shine online.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 hover:border-blue-500 transition-all shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-search-plus text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">SEO Foundations</h3>
              <p className="text-slate-500 mb-8">We fix all the errors found in your audit, ensuring Google understands your business perfectly.</p>
              <button onClick={() => setCurrentPage('contact')} className="text-blue-600 font-bold hover:underline">Learn More</button>
            </div>
            
            <div className="bg-white p-10 rounded-3xl border border-slate-200 hover:border-blue-500 transition-all shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-share-alt text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Social Presence</h3>
              <p className="text-slate-500 mb-8">Custom-designed social preview images for every page of your site for 100% professional sharing.</p>
              <button onClick={() => setCurrentPage('contact')} className="text-blue-600 font-bold hover:underline">Learn More</button>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-slate-200 hover:border-blue-500 transition-all shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-tachometer-alt text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Speed & Core Vitals</h3>
              <p className="text-slate-500 mb-8">Beyond tags: we optimize your site's load speed to improve user experience and ranking.</p>
              <button onClick={() => setCurrentPage('contact')} className="text-blue-600 font-bold hover:underline">Learn More</button>
            </div>
          </div>
          
          <div className="mt-20 bg-slate-900 text-white p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between text-left gap-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">Ready to grow your visibility?</h3>
              <p className="text-slate-400">Join 500+ businesses who trust Mapmyspot.</p>
            </div>
            <button 
              onClick={() => setCurrentPage('contact')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg whitespace-nowrap transition-all"
            >
              Get a Custom Quote
            </button>
          </div>
        </div>
      );
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {renderContent()}
      </main>
      
      {/* Global Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
              <i className="fas fa-map-marker-alt text-white"></i>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Mapmyspot</span>
          </div>
          <p className="text-sm">© 2024 Mapmyspot Agency. Helping small businesses win the web.</p>
          <div className="flex gap-6 text-xl">
            <i className="fab fa-twitter hover:text-white cursor-pointer"></i>
            <i className="fab fa-linkedin hover:text-white cursor-pointer"></i>
            <i className="fab fa-facebook hover:text-white cursor-pointer"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
