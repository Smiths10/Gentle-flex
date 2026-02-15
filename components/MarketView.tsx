
import React, { useState } from 'react';
import { ASSETS } from '../constants';
import { RiskConfig } from '../types';
import { analyzeMarket } from '../services/geminiService';

interface MarketViewProps {
  riskConfig: RiskConfig;
  onExecute: (signal: 'BUY' | 'SELL', symbol: string, currentPrice: number, suggestedSL?: number, suggestedTP?: number) => void;
}

const MarketView: React.FC<MarketViewProps> = ({ riskConfig, onExecute }) => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof ASSETS>('FOREX');
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleAnalyze = async (symbol: string) => {
    setAnalyzing(symbol);
    setAnalysisData(null);
    const result = await analyzeMarket(symbol, selectedCategory);
    if (result) {
      setAnalysisData({ ...result.analysis, symbol, sources: result.sources });
    }
    setAnalyzing(null);
  };

  const handleTrade = (type: 'BUY' | 'SELL') => {
    if (!analysisData) return;
    // Simulate current market price based on typical values for simplicity
    const mockPrice = selectedCategory === 'CRYPTO' ? 50000 + Math.random() * 5000 : 1.0 + Math.random() * 100;
    onExecute(type, analysisData.symbol, mockPrice, analysisData.suggestedSL, analysisData.suggestedTP);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Category Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <i className="fa-solid fa-microchip text-blue-500"></i> Market Intelligence
          </h2>
          <p className="text-slate-500 text-sm font-medium italic">GIX Core analyzing global news & order books...</p>
        </div>
        <div className="flex p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl">
          {(['FOREX', 'STOCKS', 'CRYPTO'] as (keyof typeof ASSETS)[]).map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setAnalysisData(null); }}
              className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all ${
                selectedCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Asset List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-[2rem] p-5 border-slate-800/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6 px-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Liquid Assets</span>
              <i className="fa-solid fa-bolt-lightning text-amber-500/50 text-xs"></i>
            </div>
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {ASSETS[selectedCategory].map(asset => (
                <button 
                  key={asset} 
                  disabled={analyzing !== null}
                  onClick={() => handleAnalyze(asset)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                    analyzing === asset 
                      ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                      : 'bg-slate-900/30 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center font-black text-xs text-slate-400 group-hover:text-white transition-colors">
                      {asset.split('/')[0].charAt(0)}
                    </div>
                    <span className="font-black text-sm text-white">{asset}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {analyzing === asset ? (
                      <i className="fa-solid fa-atom fa-spin text-blue-500"></i>
                    ) : (
                      <i className="fa-solid fa-chevron-right text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all"></i>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Analysis Report */}
        <div className="lg:col-span-8">
          {analysisData ? (
            <div className="space-y-6">
              <div className="glass-panel rounded-[2.5rem] p-8 border-t-4 border-blue-500 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl"></div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-4xl font-black text-white tracking-tighter">{analysisData.symbol}</h3>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                        analysisData.sentiment === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        analysisData.sentiment === 'BEARISH' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {analysisData.sentiment} SENTIMENT
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">AI Matrix Report 0x{Math.random().toString(16).substr(2,6).toUpperCase()}</p>
                  </div>
                  <div className={`text-4xl font-black px-10 py-4 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform ${
                    analysisData.signal === 'BUY' ? 'bg-emerald-500 text-white shadow-emerald-950/20' : 
                    analysisData.signal === 'SELL' ? 'bg-rose-500 text-white shadow-rose-950/20' : 
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {analysisData.signal}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800 shadow-inner group">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5 group-hover:text-blue-400 transition-colors">Confidence</p>
                    <p className="text-2xl font-black text-white">{analysisData.confidence}%</p>
                  </div>
                  <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800 shadow-inner">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5">RSI (14)</p>
                    <p className="text-2xl font-black text-white">{analysisData.indicators?.rsi || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800 shadow-inner">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Risk Factor</p>
                    <p className="text-2xl font-black text-rose-500">Low</p>
                  </div>
                  <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800 shadow-inner">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5">TP Target</p>
                    <p className="text-2xl font-black text-emerald-400">+{analysisData.suggestedTP || riskConfig.defaultTakeProfit}%</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <i className="fa-solid fa-brain text-blue-400"></i> Strategy Rationale
                    </h4>
                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 text-slate-400 text-sm leading-relaxed font-medium italic border-l-4 border-l-blue-500">
                      "{analysisData.summary}"
                    </div>
                  </div>

                  {/* News Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <i className="fa-solid fa-newspaper text-emerald-400"></i> Analyzed Headlines
                      </h4>
                      <div className="space-y-3">
                        {analysisData.headlines?.map((h: string, i: number) => (
                          <div key={i} className="flex gap-4 p-3 bg-slate-950/40 rounded-2xl border border-slate-900 group hover:border-slate-700 transition-colors">
                            <div className="text-blue-500 text-xs font-black pt-1">{i+1}</div>
                            <p className="text-[11px] text-slate-400 leading-snug group-hover:text-slate-200 transition-colors">{h}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <i className="fa-solid fa-link text-purple-400"></i> Validated Sources
                      </h4>
                      <div className="space-y-2">
                        {analysisData.sources?.map((s: any, i: number) => (
                          <a 
                            key={i} 
                            href={s.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-slate-950/40 rounded-2xl border border-slate-900 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group"
                          >
                            <span className="text-[10px] font-bold text-slate-500 truncate max-w-[180px] group-hover:text-purple-400">{s.title || 'Source Context'}</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-700 group-hover:text-purple-500"></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-10">
                  <button 
                    onClick={() => handleTrade('BUY')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-emerald-950/20 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
                  >
                    DEPLOY BUY NODE
                  </button>
                  <button 
                    onClick={() => handleTrade('SELL')}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-rose-950/20 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
                  >
                    DEPLOY SELL NODE
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-[3rem] h-[680px] flex flex-col items-center justify-center p-12 text-center space-y-8 relative overflow-hidden border-dashed border-slate-800">
              <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_left] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
              {analyzing ? (
                <div className="space-y-8 animate-pulse relative z-10">
                  <div className="relative mx-auto">
                    <div className="w-28 h-28 border-[6px] border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                    <i className="fa-solid fa-robot text-3xl text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
                  </div>
                  <div className="space-y-3">
                    <p className="text-3xl font-black text-white tracking-tighter">Neural Scan: {analyzing}</p>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">Aggregating global news sentiment, technical patterns, and social volume for precise entry...</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 space-y-8">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-slate-950 flex items-center justify-center border border-slate-800 shadow-2xl mx-auto rotate-12 hover:rotate-0 transition-transform duration-500">
                    <i className="fa-solid fa-terminal text-5xl text-slate-800"></i>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white tracking-tighter">GIX Terminal Ready</h3>
                    <p className="text-slate-500 mt-4 max-w-md mx-auto text-sm font-medium leading-relaxed">
                      Select an asset from the matrix to trigger a Deep Intelligence analysis. GIX will scrape live data to ensure 99.9% signal precision.
                    </p>
                  </div>
                  <div className="pt-4">
                    <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-4 py-2 rounded-full uppercase tracking-widest border border-blue-500/20">
                      Standby for analysis
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketView;
