import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import AuditResult from './components/AuditResult';
import { runAudit } from './services/auditService';
import { AuditResponse } from './types';
import { guides } from './content/guides';

// Simple Animated Counter Hook
const useCountUp = (end: number, duration: number = 2000, trigger: boolean = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, trigger]);

  return count;
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentGuideSlug, setCurrentGuideSlug] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [isHoveringDashboard, setIsHoveringDashboard] = useState(false);

  const visScore = useCountUp(94, 2500, currentPage === 'home');
  const callGrowth = useCountUp(315, 2000, currentPage === 'home');
  const mapActions = useCountUp(128, 2200, currentPage === 'home');

  useEffect(() => {
    if (currentPage === 'guide-post' && currentGuideSlug) {
      const post = guides.find(g => g.slug === currentGuideSlug);
      if (post) document.title = `${post.title} | Mapmyspot`;
    } else {
      document.title = 'Mapmyspot | Local SEO Growth Engine';
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
            reviewsSectionFound: false,
          },
          localReadinessScore: 0,
          recommendations: [],
        };
      }

      setAuditData(result);
    } catch (err) {
      alert('Analysis failed. Please check the URL.');
      setCurrentPage('home');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const navigateToGuide = (slug: string) => {
    setCurrentGuideSlug(slug);
    setCurrentPage('guide-post');
    window.scrollTo(0, 0);
  };

  const renderHome = () => (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Headline */}
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8 animate-pulse">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
          Verify Your Local SEO Dominance
        </div>
        <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tighter">
          Don't be <span className="text-blue-600">invisible</span> <br className="hidden lg:block" /> on Google.
        </h1>
        <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
          Is your business stuck on page 2? We analyze your site's technical health and local pack visibility in 60 seconds.
        </p>

        <form onSubmit={handleStartAudit} className="relative max-w-2xl mx-auto mb-24 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition-opacity"></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 flex overflow-hidden">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter your website URL..."
              className="flex-1 pl-6 pr-4 py-5 rounded-2xl outline-none text-lg font-medium text-slate-900"
            />
            <button
              type="submit"
              className="bg-slate-900 text-white px-10 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
            >
              Scan Site
            </button>
          </div>
        </form>
      </div>

      {/* Visual Impact Dashboard */}
      <section className="max-w-7xl mx-auto px-4 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            See What Happens When Your Site Becomes Visible
          </h2>
          <p className="text-slate-500 font-medium">Hover to simulate a live audit scan and witness the growth curve.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Comparison Panel */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 relative"
            onMouseEnter={() => setIsHoveringDashboard(true)}
            onMouseLeave={() => setIsHoveringDashboard(false)}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-2xl border border-slate-100 text-blue-600 font-black italic scale-110">
              VS
            </div>

            {/* Before */}
            <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-4">Baseline Audit</span>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500 ${
                          isHoveringDashboard ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-red-400'
                        }`}
                      >
                        <i className={`fas ${isHoveringDashboard ? 'fa-check' : 'fa-times'} text-[8px]`}></i>
                      </div>
                      <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-slate-300 transition-all duration-1000 ${
                            isHoveringDashboard ? 'w-full !bg-emerald-400' : 'w-1/3'
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-12 text-center">
                <p className="text-3xl font-black text-slate-300 mb-1">Poor</p>
                <p className="text-[10px] font-black text-slate-300 uppercase">Search Authority</p>
              </div>
            </div>

            {/* After */}
            <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between group">
              <div
                className={`absolute inset-0 bg-blue-600/10 blur-3xl transition-opacity duration-700 ${
                  isHoveringDashboard ? 'opacity-100' : 'opacity-0'
                }`}
              ></div>

              {/* Scan Bar Animation */}
              <div
                className={`absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-[2000ms] ease-in-out pointer-events-none ${
                  isHoveringDashboard ? 'top-full opacity-100' : 'top-0 opacity-0'
                }`}
              ></div>

              <div className="relative z-10">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-4">Post-Optimization</span>
                <div className="space-y-3">
                  <p className="text-white text-sm font-bold flex items-center gap-2">
                    <i className="fas fa-check-circle text-emerald-400"></i> Local Pack Ranked #1
                  </p>
                  <p className="text-white text-sm font-bold flex items-center gap-2">
                    <i className="fas fa-check-circle text-emerald-400"></i> Speed Score 99/100
                  </p>
                  <p className="text-white text-sm font-bold flex items-center gap-2">
                    <i className="fas fa-check-circle text-emerald-400"></i> Schema Verified
                  </p>
                </div>
              </div>

              <div className="mt-12 text-center relative z-10">
                <p className="text-4xl font-black text-white mb-1">A+</p>
                <p className="text-[10px] font-black text-blue-400 uppercase">Visibility Grade</p>
              </div>
            </div>
          </div>

          {/* Growth Chart Panel */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Growth Trend</h3>
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                  <span className="text-[10px] font-black text-blue-600 uppercase">Live Projection</span>
                </div>
              </div>

              <div className="h-48 w-full relative">
                <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                  <path
                    d="M0,140 C40,135 80,120 120,90 C160,60 220,70 280,30 C340,-10 380,10 400,5"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                    className="animate-[draw_3s_ease-out_forwards]"
                  />
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                  <path
                    d="M0,140 C40,135 80,120 120,90 C160,60 220,70 280,30 C340,-10 380,10 400,5 V150 H0 Z"
                    fill="url(#chartFill)"
                  />
                  {[120, 280, 400].map((x, i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={i === 0 ? 90 : i === 1 ? 30 : 5}
                      r="4"
                      fill="#2563eb"
                      className="animate-bounce"
                    />
                  ))}
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="text-center p-4 bg-slate-50 rounded-2xl hover:scale-105 transition-transform cursor-default">
                <p className="text-2xl font-black text-slate-900">+{visScore}%</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Visibility</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-2xl hover:scale-105 transition-transform cursor-default">
                <p className="text-2xl font-black text-slate-900">+{callGrowth}%</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Calls</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-2xl hover:scale-105 transition-transform cursor-default">
                <p className="text-2xl font-black text-slate-900">+{mapActions}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Map Leads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Home CTA Buttons */}
        <div className="mt-20 flex flex-col items-center gap-8">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              document.querySelector('input')?.focus();
            }}
            className="relative px-12 py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs group shadow-2xl transition-all active:scale-95"
          >
            <div className="absolute -inset-1 bg-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
            Start Free Audit
          </button>
          <button
            onClick={() => setCurrentPage('blog')}
            className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
          >
            See what we check <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </section>

      <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return renderHome();
const renderHowItWorks = () => (
  <div className="bg-slate-50 min-h-screen">
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">How It Works</h1>
        <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">
          A simple 3-step process to turn your website into a local lead engine.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black mb-6">1</div>
          <h3 className="text-xl font-black text-slate-900 mb-3">Scan your site</h3>
          <p className="text-slate-500 font-medium">
            Enter your URL and we audit SEO, speed, mobile usability and local signals.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black mb-6">2</div>
          <h3 className="text-xl font-black text-slate-900 mb-3">See what’s blocking growth</h3>
          <p className="text-slate-500 font-medium">
            Get clear issues + fixes (titles, headings, broken links, speed bottlenecks, local readiness).
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black mb-6">3</div>
          <h3 className="text-xl font-black text-slate-900 mb-3">Apply fixes & grow</h3>
          <p className="text-slate-500 font-medium">
            Follow the recommendations and watch your visibility, calls and map actions climb.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={() => setCurrentPage('home')}
          className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-colors shadow-xl"
        >
          Run a Free Audit
        </button>
      </div>
    </div>
  </div>
);

const renderServices = () => (
  <div className="bg-slate-50 min-h-screen">
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">Services</h1>
        <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">
          Start free, then upgrade when you’re ready for hands-on support.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Free</p>
          <h3 className="mt-3 text-2xl font-black text-slate-900">Instant Audit</h3>
          <p className="mt-3 text-slate-500 font-medium">One-click scan + key fixes.</p>
          <ul className="mt-6 space-y-3 text-slate-600 font-medium">
            <li>• SEO + headings checks</li>
            <li>• Speed & mobile signals</li>
            <li>• Local readiness hints</li>
          </ul>
          <button
            onClick={() => setCurrentPage('home')}
            className="mt-10 w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-colors"
          >
            Start Free
          </button>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10 blur-3xl"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Popular</p>
            <h3 className="mt-3 text-2xl font-black text-white">Guided Fix Plan</h3>
            <p className="mt-3 text-blue-100 font-medium">A prioritized roadmap for fast wins.</p>
            <ul className="mt-6 space-y-3 text-blue-100 font-medium">
              <li>• Step-by-step fixes</li>
              <li>• Local SEO checklist</li>
              <li>• Conversion improvements</li>
            </ul>
            <button
              onClick={() => setCurrentPage('contact')}
              className="mt-10 w-full py-4 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest text-[11px] hover:bg-blue-50 transition-colors"
            >
              Talk to Us
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Done-For-You</p>
          <h3 className="mt-3 text-2xl font-black text-slate-900">Implementation</h3>
          <p className="mt-3 text-slate-500 font-medium">We apply fixes for you.</p>
          <ul className="mt-6 space-y-3 text-slate-600 font-medium">
            <li>• Technical SEO cleanup</li>
            <li>• Local pages & schema</li>
            <li>• Speed optimization</li>
          </ul>
          <button
            onClick={() => setCurrentPage('contact')}
            className="mt-10 w-full py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-colors"
          >
            Get a Quote
          </button>
        </div>
      </div>
    </div>
  </div>
);

      case 'audit':
        return (
          <div className="min-h-screen">
            {isAnalyzing ? (
              <div className="max-w-3xl mx-auto py-40 text-center px-4">
                <div className="relative inline-block mb-12">
                  <div className="w-24 h-24 border-[12px] border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 w-24 h-24 border-[12px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Crawl in Progress...</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">
                  Checking Local Pack Relevance & Speed
                </p>
              </div>
            ) : auditData ? (
              <AuditResult data={auditData} onRequestHelp={() => setCurrentPage('contact')} />
            ) : (
              <div className="py-40 text-center">
                <button onClick={() => setCurrentPage('home')} className="text-blue-600 font-black">
                  Back to Home
                </button>
              </div>
            )}
          </div>
        );

      case 'blog':
        return (
          <div className="max-w-7xl mx-auto py-20 px-4">
            <h1 className="text-6xl font-black text-slate-900 mb-16 text-center tracking-tight">
              Growth <span className="text-blue-600">Hub</span>
            </h1>
            <div className="grid md:grid-cols-3 gap-10">
              {guides.map((post) => (
                <article
                  key={post.slug}
                  onClick={() => navigateToGuide(post.slug)}
                  className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={post.ogImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-black mb-2">{post.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );

      case 'guide-post': {
        const post = guides.find((g) => g.slug === currentGuideSlug);
        return (
          <div className="max-w-4xl mx-auto py-20 px-4">
            <button onClick={() => setCurrentPage('blog')} className="text-blue-600 font-black mb-10">
              ← Hub
            </button>
            {post && (
              <div className="prose prose-slate max-w-none">
                <h1 className="text-4xl font-black mb-10">{post.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            )}
          </div>
        );
      }

      case 'contact':
        return (
          <div className="max-w-2xl mx-auto py-24 px-6">
            <div className="bg-white rounded-[4rem] p-16 shadow-2xl border border-slate-200">
              <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Need a Hand?</h1>
              <p className="text-lg text-slate-500 mb-12 font-medium">Our specialists help local businesses win the map pack.</p>

              {submitted ? (
                <div className="py-24 text-center">
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10">
                    <i className="fas fa-check text-4xl"></i>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">Request Sent</h3>
                  <button onClick={() => setSubmitted(false)} className="text-blue-600 font-black underline">
                    Send Another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-3 block">Name</label>
                      <input required className="w-full bg-slate-50 rounded-2xl px-6 py-5 outline-none" />
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-3 block">Email</label>
                      <input required type="email" className="w-full bg-slate-50 rounded-2xl px-6 py-5 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-3 block">Website</label>
                    <input required defaultValue={urlInput} className="w-full bg-slate-50 rounded-2xl px-6 py-5 outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-3 block">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-slate-50 rounded-2xl px-6 py-5 outline-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-blue-700 transition-all"
                  >
                    Get Help
                  </button>
                </form>
              )}
            </div>
          </div>
        );

      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-600">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>{renderContent()}</main>
      <footer className="bg-white border-t border-slate-100 py-32 mt-40">
        <div className="max-w-7xl mx-auto px-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
          © 2026 Mapmyspot. Growth for local businesses.
        </div>
      </footer>
    </div>
  );
};

export default App;
