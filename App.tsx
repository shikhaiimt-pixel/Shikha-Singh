
import React, { useState, useMemo, useEffect } from 'react';
import Navigation from './components/Navigation';
import AuditResult from './components/AuditResult';
import { runAudit } from './services/auditService';
import { AuditResponse } from './types';
import { guides, GuidePost } from './content/guides';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentGuideSlug, setCurrentGuideSlug] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const categories = ['All', 'SEO Basics', 'Local SEO', 'Social Previews', 'Speed', 'Coaches', 'Plumbers', 'Salons', 'Dentists'];

  useEffect(() => {
    if (currentPage === 'guide-post' && currentGuideSlug) {
      const post = guides.find(g => g.slug === currentGuideSlug);
      if (post) {
        document.title = `${post.title} | Mapmyspot Guides`;
      }
    } else {
      document.title = 'Mapmyspot | Local SEO Website Health Checker';
    }
  }, [currentPage, currentGuideSlug]);

  const handleStartAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput) return;

    setIsAnalyzing(true);
    setAuditData(null);
    setCurrentPage('audit');

    try {
      const result = await runAudit(urlInput);
      
      // Safety check: ensure local property exists to prevent "Cannot read properties of undefined" errors
      if (!result.local) {
        result.local = {
          mapsStatus: 'unknown',
          providedGbpUrl: null,
          websiteSignals: {
            gbpLinkFound: false,
            gbpLinkUrl: null,
            napFound: false,
            addressFound: false,
            phoneFound: false,
            telLinkFound: false,
            localKeywordsFound: false,
            mapsEmbedFound: false,
            schemaLocalBusinessFound: false,
            reviewsSectionFound: false
          },
          localReadinessScore: 0,
          recommendations: []
        };
      }
      
      setAuditData(result);
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Please check the URL and your connection.');
      setCurrentPage('home');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRequestHelp = (customMessage?: string) => {
    if (customMessage) {
      setContactMessage(customMessage);
    } else {
      setContactMessage(`I need help improving my website SEO for ${urlInput}`);
    }
    setCurrentPage('contact');
  };

  const navigateToGuide = (slug: string) => {
    setCurrentGuideSlug(slug);
    setCurrentPage('guide-post');
    window.scrollTo(0, 0);
  };

  const filteredGuides = useMemo(() => {
    return guides.filter(g => {
      const matchesCategory = activeCategory === 'All' || g.category === activeCategory;
      const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            g.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const getRecommendedGuides = () => {
    if (!auditData || !auditData.local) return [];
    const recommendations: GuidePost[] = [];
    if (auditData.local.mapsStatus === 'unknown') {
      const g = guides.find(p => p.slug === 'google-business-profile-checklist');
      if (g) recommendations.push(g);
    }
    if (!auditData.social?.openGraph?.ogTitle) {
      const g = guides.find(p => p.slug === 'social-previews-open-graph-guide');
      if (g) recommendations.push(g);
    }
    if (recommendations.length < 3) {
      guides.forEach(g => {
        if (recommendations.length < 3 && !recommendations.find(r => r.slug === g.slug)) recommendations.push(g);
      });
    }
    return recommendations;
  };

  const renderHome = () => (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-40 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-ping"></span>
          Analyze Site Visibility Instantly
        </div>
        <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tighter">
          Don't be <span className="text-blue-600">invisible</span> on Google.
        </h1>
        <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
          Small business SEO is broken. We verify your website's local SEO health and identify why you aren't ranking.
        </p>
        
        <form onSubmit={handleStartAudit} className="relative max-w-2xl mx-auto mb-16 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition-opacity"></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 overflow-hidden flex">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste your URL (e.g. yourcafe.com)"
              className="flex-1 pl-6 pr-4 py-5 rounded-2xl outline-none text-lg font-medium text-slate-900"
            />
            <button type="submit" className="bg-slate-900 text-white px-10 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">
              Scan Site
            </button>
          </div>
        </form>

        <div className="mt-24 pt-24 border-t border-slate-200/50">
           <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-12">Actionable Guides for Every Industry</h3>
           <div className="grid md:grid-cols-4 gap-8">
             {['Coaches', 'Plumbers', 'Salons', 'Dentists'].map(ind => (
               <div key={ind} onClick={() => { setActiveCategory(ind as any); setCurrentPage('blog'); }} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <i className={`fas ${ind === 'Coaches' ? 'fa-user-tie' : ind === 'Plumbers' ? 'fa-faucet' : ind === 'Salons' ? 'fa-scissors' : 'fa-tooth'}`}></i>
                  </div>
                  <h4 className="font-black text-slate-900">{ind} SEO</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Browse Playbooks</p>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-600">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {currentPage === 'home' && renderHome()}
        {currentPage === 'audit' && (
          <div className="min-h-screen">
            {isAnalyzing ? (
              <div className="max-w-3xl mx-auto py-40 text-center px-4">
                <div className="relative inline-block mb-12">
                  <div className="w-24 h-24 border-[12px] border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 w-24 h-24 border-[12px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Crawl in Progress...</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Scanning local markers & Site performance</p>
              </div>
            ) : auditData ? (
              <div className="space-y-12 pb-24">
                <AuditResult data={auditData} onRequestHelp={handleRequestHelp} />
                <div className="max-w-7xl mx-auto px-4">
                   <div className="bg-white rounded-[4rem] p-16 border border-slate-200">
                      <div className="flex items-center justify-between mb-12">
                        <div>
                          <h2 className="text-3xl font-black text-slate-900 mb-2">Recommended Strategy Guides</h2>
                          <p className="text-slate-500 font-medium">Step-by-step playbooks to fix the issues found in your scan.</p>
                        </div>
                        <button onClick={() => setCurrentPage('blog')} className="text-blue-600 font-black text-[11px] uppercase tracking-widest flex items-center gap-2">View All <i className="fas fa-chevron-right"></i></button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-10">
                        {getRecommendedGuides().map(guide => (
                          <div key={guide.slug} className="group cursor-pointer" onClick={() => navigateToGuide(guide.slug)}>
                             <div className="h-48 rounded-[2rem] overflow-hidden mb-6 relative">
                               <img src={guide.ogImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={guide.title} />
                             </div>
                             <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{guide.title}</h4>
                             <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">{guide.excerpt}</p>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="py-40 text-center"><button onClick={() => setCurrentPage('home')} className="text-blue-600 font-black">Return Home</button></div>
            )}
          </div>
        )}
        {currentPage === 'blog' && (
           <div className="max-w-7xl mx-auto py-20 px-4">
              <div className="text-center mb-16">
                 <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">Growth <span className="text-blue-600">Hub</span></h1>
              </div>
              <div className="grid md:grid-cols-3 gap-10">
                 {guides.map(post => (
                    <article key={post.slug} onClick={() => navigateToGuide(post.slug)} className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group">
                       <div className="h-48 overflow-hidden"><img src={post.ogImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>
                       <div className="p-8">
                          <h3 className="text-xl font-black mb-2">{post.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                       </div>
                    </article>
                 ))}
              </div>
           </div>
        )}
        {currentPage === 'guide-post' && (
           <div className="max-w-4xl mx-auto py-20 px-4">
              <button onClick={() => setCurrentPage('blog')} className="text-blue-600 font-black mb-10">← Back to Hub</button>
              {guides.find(g => g.slug === currentGuideSlug) && (
                <div className="prose prose-slate max-w-none">
                   <h1 className="text-4xl font-black mb-10">{guides.find(g => g.slug === currentGuideSlug)?.title}</h1>
                   <div dangerouslySetInnerHTML={{ __html: guides.find(g => g.slug === currentGuideSlug)?.content || '' }} />
                </div>
              )}
           </div>
        )}
        {currentPage === 'contact' && (
          <div className="max-w-2xl mx-auto py-24 px-6">
            <div className="bg-white rounded-[4rem] p-16 shadow-2xl border border-slate-200">
               <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Need a Hand?</h1>
               <p className="text-lg text-slate-500 mb-12 font-medium leading-relaxed">Our experts can verify your GBP and optimize your presence.</p>
               {submitted ? (
                 <div className="py-24 text-center">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10"><i className="fas fa-check text-4xl"></i></div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4">Request Sent</h3>
                    <button onClick={() => setSubmitted(false)} className="text-blue-600 font-black underline">Send Another Message</button>
                 </div>
               ) : (
                <form
  action="https://formspree.io/f/xreedbpn"
  method="POST"
  className="space-y-8"
>
  <div className="grid md:grid-cols-2 gap-8">
    <div>
      <label className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-3 block">
        Name
      </label>
      <input
        name="name"
        required
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900"
      />
    </div>

    <div>
      <label className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-3 block">
        Email
      </label>
      <input
        name="email"
        type="email"
        required
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900"
      />
    </div>
  </div>

  <div>
    <label className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-3 block">
      Website URL
    </label>
    <input
      name="website"
      required
      defaultValue={urlInput}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900"
    />
  </div>

  <div>
    <label className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-3 block">
      Message
    </label>
    <textarea
      name="message"
      required
      rows={4}
      value={contactMessage}
      onChange={(e) => setContactMessage(e.target.value)}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900"
    />
  </div>

  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-blue-200"
  >
    Send Message
  </button>
</form>

               )}
            </div>
          </div>
        )}
      </main>
      <footer className="bg-white border-t border-slate-100 py-32 mt-40">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">© 2024 Mapmyspot Agency. Growth for the local map.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;
