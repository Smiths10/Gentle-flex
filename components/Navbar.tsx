
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  botStatus: boolean;
  toggleBot: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ botStatus, toggleBot }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
      isActive ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'hover:bg-slate-800'
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${botStatus ? 'from-emerald-400 to-emerald-600 animate-pulse' : 'from-slate-600 to-slate-800'}`}>
            <i className="fa-solid fa-robot text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Gentle GIX</h1>
            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${botStatus ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {botStatus ? 'Active' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>
            <i className="fa-solid fa-gauge"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/market" className={getLinkClass('/market')}>
            <i className="fa-solid fa-chart-line"></i>
            <span>Market</span>
          </Link>
          <Link to="/history" className={getLinkClass('/history')}>
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>History</span>
          </Link>
          <Link to="/settings" className={getLinkClass('/settings')}>
            <i className="fa-solid fa-sliders"></i>
            <span>Settings</span>
          </Link>
          
          <button 
            onClick={toggleBot}
            className={`ml-4 px-6 py-2 rounded-full font-bold transition-all ${
              botStatus ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {botStatus ? 'STOP BOT' : 'START BOT'}
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur shadow-2xl absolute w-full left-0 top-16 border-b border-slate-800 py-4 flex flex-col space-y-2 px-4">
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className={getLinkClass('/dashboard')}>Dashboard</Link>
          <Link to="/market" onClick={() => setIsOpen(false)} className={getLinkClass('/market')}>Market</Link>
          <Link to="/history" onClick={() => setIsOpen(false)} className={getLinkClass('/history')}>History</Link>
          <Link to="/settings" onClick={() => setIsOpen(false)} className={getLinkClass('/settings')}>Settings</Link>
          <button 
            onClick={() => { toggleBot(); setIsOpen(false); }}
            className={`w-full py-3 rounded-xl font-bold ${botStatus ? 'bg-rose-600' : 'bg-emerald-600'}`}
          >
            {botStatus ? 'STOP BOT' : 'START BOT'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
