
import React, { useState } from 'react';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Free Audit', id: 'audit' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'Services', id: 'services' },
    { label: 'Guides', id: 'blog' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group" 
              onClick={() => onNavigate('home')}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform">
                <i className="fas fa-map-marker-alt text-white text-xl"></i>
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter">
                Mapmyspot
              </span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-[11px] font-black uppercase tracking-widest transition-all ${
                  currentPage === item.id || (item.id === 'blog' && currentPage === 'guide-post')
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-400 hover:text-blue-600'
                } py-2`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => onNavigate('audit')}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
            >
              Start Free Audit
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-blue-600 w-10 h-10 flex items-center justify-center"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 py-6 px-4 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl text-[11px] font-black uppercase tracking-widest"
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => { onNavigate('audit'); setIsOpen(false); }}
            className="block w-full text-center bg-blue-600 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg"
          >
            Start Free Audit
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
