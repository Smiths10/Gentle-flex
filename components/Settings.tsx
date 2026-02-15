
import React, { useState } from 'react';
import { Broker, BrokerStatus, RiskConfig } from '../types';

interface SettingsProps {
  brokers: Broker[];
  setBrokers: React.Dispatch<React.SetStateAction<Broker[]>>;
  riskConfig: RiskConfig;
  setRiskConfig: React.Dispatch<React.SetStateAction<RiskConfig>>;
}

const Settings: React.FC<SettingsProps> = ({ brokers, setBrokers, riskConfig, setRiskConfig }) => {
  const [editingBroker, setEditingBroker] = useState<string | null>(null);
  const [tempApi, setTempApi] = useState({ key: '', secret: '' });
  const [isValidating, setIsValidating] = useState(false);

  const handleConnect = (id: string) => {
    if (!tempApi.key || !tempApi.secret) return;

    setIsValidating(true);
    
    // Simulating deep API handshake verification
    setTimeout(() => {
      // Rule: Keys must be of a certain length for simulation purposes
      const isValid = tempApi.key.length >= 8 && tempApi.secret.length >= 12;
      
      setBrokers(prev => prev.map(b => b.id === id ? {
        ...b,
        apiKey: tempApi.key,
        apiSecret: tempApi.secret,
        status: isValid ? BrokerStatus.CONNECTED : BrokerStatus.ERROR,
        errorMessage: isValid ? undefined : 'Critical Handshake Error: Unauthorized API Credentials or Invalid Project Scope.',
        balance: isValid ? (2000 + Math.random() * 50000) : 0,
        winRate: isValid ? (72 + Math.random() * 22) : 0,
        avgProfit: isValid ? (150 + Math.random() * 800) : 0,
        executionSpeed: isValid ? (2 + Math.random() * 15) : 0
      } : b));

      setIsValidating(false);
      if (isValid) {
        setEditingBroker(null);
        setTempApi({ key: '', secret: '' });
      }
    }, 1800);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <i className="fa-solid fa-key text-purple-500"></i> API Connectivity Vault
          </h2>
          <p className="text-slate-500 text-sm font-medium">Link your trading nodes via secure API bridge.</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase">Security Protocol</span>
            <span className="text-xs font-bold text-emerald-400">Encrypted End-to-End</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <i className="fa-solid fa-lock text-emerald-500 text-xs"></i>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Risk Profile Engine */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2 px-1">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
              <i className="fa-solid fa-gauge-high text-blue-400"></i>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Strategy Configuration</h3>
          </div>
          
          <div className="glass-panel p-8 rounded-[2.5rem] space-y-10 border-slate-800 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Max Leverage</label>
                  <span className="font-black text-blue-400 text-lg">{riskConfig.maxLeverage}x</span>
                </div>
                <input 
                  type="range" min="1" max="100" 
                  value={riskConfig.maxLeverage} 
                  onChange={(e) => setRiskConfig({...riskConfig, maxLeverage: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Risk Calculation</label>
                <div className="flex bg-slate-950 p-1.5 rounded-[1.25rem] border border-slate-800">
                  <button 
                    onClick={() => setRiskConfig({...riskConfig, isPercentage: true})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${riskConfig.isPercentage ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                  >PERCENT (%)</button>
                  <button 
                    onClick={() => setRiskConfig({...riskConfig, isPercentage: false})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${!riskConfig.isPercentage ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                  >FIXED ($)</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Default Stop Loss ({riskConfig.isPercentage ? '%' : 'USD'})</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={riskConfig.defaultStopLoss}
                    onChange={(e) => setRiskConfig({...riskConfig, defaultStopLoss: parseFloat(e.target.value)})}
                    className="w-full bg-slate-950 border-2 border-slate-900 rounded-2xl px-5 py-4 text-white font-black focus:outline-none focus:border-rose-500/50 transition-all text-lg"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none group-focus-within:animate-bounce">
                    <i className="fa-solid fa-arrow-trend-down"></i>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Default Take Profit ({riskConfig.isPercentage ? '%' : 'USD'})</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={riskConfig.defaultTakeProfit}
                    onChange={(e) => setRiskConfig({...riskConfig, defaultTakeProfit: parseFloat(e.target.value)})}
                    className="w-full bg-slate-950 border-2 border-slate-900 rounded-2xl px-5 py-4 text-white font-black focus:outline-none focus:border-emerald-500/50 transition-all text-lg"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none group-focus-within:animate-bounce">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-3">
              <div className="flex items-center gap-3 text-blue-400">
                <i className="fa-solid fa-robot"></i>
                <span className="text-xs font-black uppercase tracking-widest">GIX Intelligence Note</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                The AI will prioritize these safety metrics for every automated trade execution. You can still manually adjust SL/TP for specific live positions from the dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Broker Nodes Panel */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2 px-1">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center border border-purple-500/20">
              <i className="fa-solid fa-network-wired text-purple-400"></i>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Liquidity Gateways</h3>
          </div>
          
          <div className="glass-panel rounded-[2.5rem] overflow-hidden border-slate-800 shadow-2xl">
            <div className="max-h-[640px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
              {brokers.map(broker => (
                <div key={broker.id} className="p-6 border-b border-slate-800/50 hover:bg-slate-900/40 transition-all group relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-5">
                      <div className={`w-4 h-4 rounded-full ${
                        broker.status === BrokerStatus.CONNECTED ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 
                        broker.status === BrokerStatus.ERROR ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-slate-800'
                      }`}></div>
                      <div>
                        <h4 className="font-black text-lg text-white group-hover:text-blue-400 transition-colors">{broker.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                            broker.type === 'FOREX' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            broker.type === 'CRYPTO' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}>{broker.type}</span>
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{broker.status}</span>
                        </div>
                      </div>
                    </div>
                    {broker.status === BrokerStatus.CONNECTED ? (
                      <button 
                        onClick={() => setBrokers(prev => prev.map(b => b.id === broker.id ? {...b, status: BrokerStatus.DISCONNECTED} : b))}
                        className="text-[10px] font-black text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2 transition-all"
                      >DISCONNECT</button>
                    ) : (
                      <button 
                        onClick={() => setEditingBroker(broker.id)}
                        className="text-[10px] font-black text-blue-400 hover:bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2 transition-all"
                      >AUTHORIZE</button>
                    )}
                  </div>

                  {broker.status === BrokerStatus.CONNECTED && (
                    <div className="grid grid-cols-3 gap-3 mt-4 animate-fadeIn">
                      <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
                        <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Win Probability</p>
                        <p className="text-sm font-black text-emerald-400">{broker.winRate.toFixed(1)}%</p>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
                        <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Node Latency</p>
                        <p className="text-sm font-black text-blue-400">{broker.executionSpeed.toFixed(0)}ms</p>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
                        <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Vault Balance</p>
                        <p className="text-sm font-black text-white">${broker.balance.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {broker.status === BrokerStatus.ERROR && (
                    <div className="mt-4 p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-[10px] text-rose-400 font-bold italic animate-shake">
                      <i className="fa-solid fa-triangle-exclamation mr-2"></i> {broker.errorMessage}
                    </div>
                  )}

                  {editingBroker === broker.id && (
                    <div className="mt-6 p-6 bg-slate-950 rounded-[2rem] border-2 border-blue-500/30 space-y-5 animate-slideInUp shadow-2xl relative overflow-hidden">
                      {isValidating && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-4">Verifying API Credentials...</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">API Endpoint Key</label>
                        <input 
                          type="password"
                          value={tempApi.key}
                          onChange={(e) => setTempApi({...tempApi, key: e.target.value})}
                          placeholder="••••••••••••••••"
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Private Security Token</label>
                        <input 
                          type="password"
                          value={tempApi.secret}
                          onChange={(e) => setTempApi({...tempApi, secret: e.target.value})}
                          placeholder="••••••••••••••••••••••••"
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 font-mono"
                        />
                      </div>
                      <div className="flex gap-4 pt-2">
                        <button 
                          onClick={() => handleConnect(broker.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest"
                        >Bridge Link</button>
                        <button 
                          onClick={() => setEditingBroker(null)}
                          className="px-6 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black rounded-2xl transition-all uppercase tracking-widest"
                        >Abort</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
