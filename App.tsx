
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

       {/* Growth Snapshot Section */}
<section className="mt-24 pt-24 border-t border-slate-200/50">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      {/* Left */}
      <div>
        <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em]">
          Business Growth Snapshot
        </p>

        <h2 className="mt-4 text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          Make your website visible — and turn more visitors into enquiries
        </h2>

        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
          Run a free audit and get clear, practical fixes for SEO, speed, mobile and local signals — built for any small business.
        </p>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-2xl font-black text-slate-900">+38%</div>
            <div className="text-sm text-slate-600">Local clicks</div>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-2xl font-black text-slate-900">-1.2s</div>
            <div className="text-sm text-slate-600">Faster load</div>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-2xl font-black text-slate-900">+21%</div>
            <div className="text-sm text-slate-600">More enquiries</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 items-center">
          <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-semibold">
            Built for any local business
          </span>
          <span className="text-sm text-slate-500">
            coaches • trades • clinics • salons • agencies • and more
          </span>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900">Traffic trend</div>
            <div className="text-xs text-slate-500">last 30 days</div>
          </div>
          <div className="rounded-xl bg-slate-50 border px-3 py-2 text-sm font-bold text-slate-700">
            Audit Score: <span className="text-blue-600">82/100</span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 border p-4">
          <svg viewBox="0 0 520 220" className="w-full h-auto" role="img" aria-label="Traffic increasing over time">
            <g opacity="0.2">
              <line x1="0" y1="40" x2="520" y2="40" stroke="currentColor" />
              <line x1="0" y1="90" x2="520" y2="90" stroke="currentColor" />
              <line x1="0" y1="140" x2="520" y2="140" stroke="currentColor" />
              <line x1="0" y1="190" x2="520" y2="190" stroke="currentColor" />
            </g>

            <path
              d="M 0 190
                 C 70 170, 90 160, 120 165
                 C 150 170, 170 140, 205 135
                 C 240 130, 260 150, 295 120
                 C 330 90, 360 110, 395 85
                 C 430 55, 460 70, 520 35
                 L 520 220 L 0 220 Z"
              fill="currentColor"
              className="text-blue-100"
            />

            <path
              d="M 0 190
                 C 70 170, 90 160, 120 165
                 C 150 170, 170 140, 205 135
                 C 240 130, 260 150, 295 120
                 C 330 90, 360 110, 395 85
                 C 430 55, 460 70, 520 35"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-blue-600"
            />
          </svg>

          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-white border p-3">
              <div className="font-black text-slate-900">SEO</div>
              <div className="text-slate-600 text-xs">Meta + headings</div>
            </div>
            <div className="rounded-xl bg-white border p-3">
              <div className="font-black text-slate-900">Speed</div>
              <div className="text-slate-600 text-xs">Core web vitals</div>
            </div>
            <div className="rounded-xl bg-white border p-3">
              <div className="font-black text-slate-900">Local</div>
              <div className="text-slate-600 text-xs">Maps signals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      </div>
    </div>
  );

  const renderHowItWorks = () => (
   <section className="max-w-6xl mx-auto px-6 py-16">
    <div className="max-w-3xl">
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
        How it works
      </p>
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-3">
        A simple local SEO workflow that turns your website into a lead generator.
      </h1>
      <p className="mt-5 text-lg text-slate-600 leading-relaxed">
        Mapmyspot helps small businesses understand why they’re not showing up on Google —
        and what to fix first. Start with a quick website & local visibility check, then follow
        clear, practical steps to improve rankings, trust, and enquiries.
      </p>
    </div>

   <div className="mt-10 grid md:grid-cols-2 gap-6">
  <div className="bg-white rounded-2xl border border-slate-200 p-6">
    <h2 className="text-2xl font-black text-slate-900">1) Run a quick local SEO check</h2>
    <p className="mt-3 text-slate-600 leading-relaxed">
      Enter your website and we scan the essentials that impact local visibility: page titles, headings, indexability,
      speed signals, internal linking, location relevance, and trust factors.
    </p>
  </div>

  <div className="bg-white rounded-2xl border border-slate-200 p-6">
    <h2 className="text-2xl font-black text-slate-900">2) Review what’s holding you back</h2>
    <p className="mt-3 text-slate-600 leading-relaxed">
      You’ll get clear findings in plain language — what’s missing, what’s incorrect, and what to fix first.
      We focus on the changes that typically move the needle fastest for small businesses.
    </p>
  </div>

  <div className="bg-white rounded-2xl border border-slate-200 p-6">
    <h2 className="text-2xl font-black text-slate-900">3) Follow a prioritized action plan</h2>
    <p className="mt-3 text-slate-600 leading-relaxed">
      Instead of a long technical report, you get a checklist ordered by impact: quick wins, medium-effort improvements,
      and longer-term growth tasks.
    </p>
  </div>

  <div className="bg-white rounded-2xl border border-slate-200 p-6">
    <h2 className="text-2xl font-black text-slate-900">4) Improve, then re-check</h2>
    <p className="mt-3 text-slate-600 leading-relaxed">
      After updates, run the check again to confirm improvements. Local SEO is iterative — small fixes done consistently
      compound into better rankings, more calls, and more enquiries.
    </p>
  </div>
</div>

<div className="mt-12 bg-slate-50 rounded-2xl border border-slate-200 p-6">
  <h2 className="text-2xl font-black text-slate-900">Who this is for</h2>
  <p className="mt-3 text-slate-600 leading-relaxed">
    Mapmyspot is built for any local business that wants more customers from Google — trades, clinics, salons,
    agencies, consultants, restaurants, studios, and growing service businesses (and more).
  </p>
</div>


    <div className="mt-12 grid lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-black text-slate-900">What the audit checks</h2>
        <p className="mt-3 text-slate-600 leading-relaxed">
          We focus on the foundations that matter for local search — not vanity metrics.
          You’ll get a quick view of what Google can understand about your business and pages.
        </p>
        <ul className="mt-4 space-y-2 text-slate-700">
          <li>• Title tags & meta descriptions (are they written for clicks + relevance?)</li>
          <li>• Headings & page structure (H1/H2 clarity for your service + location)</li>
          <li>• Content depth & topic relevance (does the page answer real customer questions?)</li>
          <li>• Technical basics (mobile readiness, indexability, crawl signals)</li>
          <li>• Local trust markers (contact details, location info, consistency)</li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-black text-slate-900">Why local businesses don’t rank</h2>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Most websites look “nice” but still don’t rank because Google can’t confidently match
          the business to a search intent or location.
        </p>
        <ul className="mt-4 space-y-2 text-slate-700">
          <li>• Service pages are too thin (“we offer X”) with no proof, details, or FAQs</li>
          <li>• No clear location focus (city/area not mentioned in the right places)</li>
          <li>• Missing trust signals (contact info, real photos, reviews, credentials)</li>
          <li>• Duplicate or unclear page topics (Google doesn’t know what to rank)</li>
          <li>• Technical issues that block crawling or slow down the experience</li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-black text-slate-900">Who this is for</h2>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Mapmyspot is built for any small business that wants more local customers —
          without needing to become an SEO expert.
        </p>
        <p className="mt-4 text-slate-700">
          Examples: <strong>coaches</strong>, <strong>plumbers</strong>, <strong>salons</strong>,{" "}
          <strong>dentists</strong>, <strong>therapists</strong>, <strong>cleaners</strong>,{" "}
          <strong>electricians</strong>, <strong>gyms</strong>, <strong>restaurants</strong>, and more —
          but it works for almost any local service.
        </p>
        <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4">
          <p className="text-slate-700">
            <strong>Tip:</strong> The fastest wins usually come from improving the “Services” page
            and creating 1 strong page per core service (with FAQs + local details).
          </p>
        </div>
      </div>
    </div>

    <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8">
      <h2 className="text-2xl font-black text-slate-900">Frequently asked questions</h2>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-lg font-black text-slate-900">
            Do I need a Google Business Profile to rank locally?
          </h3>
          <p className="mt-2 text-slate-600 leading-relaxed">
            It helps a lot, but your website still matters. Strong service pages, clear contact details,
            and consistent local information increase trust and improve performance across searches.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">
            How long does it take to see improvements?
          </h3>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Some fixes improve clarity immediately (better titles, better structure). Ranking changes
            usually take time as Google re-crawls and re-evaluates pages. The key is doing the right
            fixes in the right order.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">
            What should I fix first if my pages are empty or thin?
          </h3>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Start with one high-quality “Services” page (overview), then build a dedicated page for
            each main service. Add real FAQs, proof, process, service areas, and clear calls-to-action.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setCurrentPage("audit")}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-blue-200"
        >
          Start Free Audit
        </button>
        <button
          onClick={() => setCurrentPage("services")}
          className="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px]"
        >
          See Services
        </button>
      </div>
    </div>
  </section>
);


const renderServices = () => (
  <section className="max-w-5xl mx-auto px-6 py-16">
    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
      Services
    </h1>
    <p className="mt-4 text-lg text-slate-600">
      We help small businesses improve local visibility and turn searches into real enquiries.
      Start with the free audit, then choose the support you need.
    </p>

    <div className="mt-10 grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
</div>
  </div>
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-600">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
  {currentPage === 'home' && renderHome()}
  {currentPage === 'how-it-works' && renderHowItWorks()}
  {currentPage === 'services' && renderServices()}

  {!['home','how-it-works','services','audit'].includes(currentPage) && renderHome()}

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
    ></textarea>
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
    </section>
  );
};

export default App;
