
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-10 px-6 border-t border-slate-900 bg-slate-950/95 backdrop-blur-xl">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
          <div className="flex flex-col items-center md:items-start space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-slate-700 shadow-xl">
                <i className="fa-solid fa-microchip text-emerald-500"></i>
              </div>
              <span className="font-black text-white tracking-tighter text-lg">GENTLE GIX v2.1</span>
            </div>
            <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed text-center md:text-left font-medium">
              Institutional-grade automated trading assistant leveraging Gemini 3 Pro intelligence for precise market execution.
            </p>
          </div>
          
          <div className="flex justify-center space-x-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-blue-400 transition-colors">Broker API</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Risk Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">GIX Nodes</a>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.2em] mb-1">Architect & Principal</p>
            <p className="text-xl font-black bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
              GENTLE SMITH
            </p>
            <div className="flex space-x-3 mt-3">
              <i className="fa-brands fa-github text-slate-600 hover:text-white cursor-pointer transition-colors"></i>
              <i className="fa-brands fa-linkedin text-slate-600 hover:text-white cursor-pointer transition-colors"></i>
              <i className="fa-brands fa-x-twitter text-slate-600 hover:text-white cursor-pointer transition-colors"></i>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-900/50 text-center">
          <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">
            © 2024 Gentle GIX Suite. All Rights Reserved. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
