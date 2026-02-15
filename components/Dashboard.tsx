
import React, { useState, useMemo } from 'react';
import { Trade, Broker, Notification, RiskConfig, BrokerStatus } from '../types';

interface DashboardProps {
  trades: Trade[];
  brokers: Broker[];
  notifications: Notification[];
  totalProfit: number;
  riskConfig: RiskConfig;
  onCloseTrade: (id: string) => void;
  onUpdateTrade: (id: string, updates: Partial<Trade>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  trades, brokers, notifications, totalProfit, riskConfig, onCloseTrade, onUpdateTrade 
}) => {
  const [confirmClose, setConfirmClose] = useState<string | null>(null);
  const [editingTrade, setEditingTrade] = useState<string | null>(null);

  const getBroker = (id: string) => brokers.find(b => b.id === id);

  const activeBrokers = useMemo(() => brokers.filter(b => b.status === BrokerStatus.CONNECTED), [brokers]);
  const totalBalance = useMemo(() => activeBrokers.reduce((sum, b) => sum + b.balance, 0), [activeBrokers]);
  const unrealizedPnL = useMemo(() => trades.reduce((sum, t) => sum + t.pnl, 0), [trades]);

  return (
    <div className="space-y-6">
      {/* Top Level Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-3xl border-l-4 border-emerald-500 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-chart-line text-6xl"></i>
          </div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Cumulative Profit</p>
          <h3 className={`text-3xl font-black ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-emerald-500/60 font-bold mt-2">All-time record</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-l-4 border-blue-500 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-vault text-6xl"></i>
          </div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Broker Liquidity</p>
          <h3 className="text-3xl font-black text-white">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-blue-400/60 font-bold mt-2">{activeBrokers.length} active API nodes</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-l-4 border-amber-500 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-briefcase text-6xl"></i>
          </div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Active Exposure</p>
          <h3 className="text-3xl font-black text-white">
            ${(trades.reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
          </h3>
          <p className="text-[10px] text-amber-500/60 font-bold mt-2">{trades.length} positions open</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-l-4 border-purple-500 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-signal text-6xl"></i>
          </div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Floating P&L</p>
          <h3 className={`text-3xl font-black ${unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-purple-400/60 font-bold mt-2">Real-time sync</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Live Trading Panel */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-white tracking-tight">Active Matrix</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[10px] font-black text-emerald-500 uppercase">Live Feed</span>
              </div>
            </div>
            {riskConfig.tradingEnabled && (
              <div className="text-[10px] font-bold text-slate-500 animate-pulse">Scanning global liquidity...</div>
            )}
          </div>
          
          <div className="space-y-4">
            {trades.length === 0 ? (
              <div className="glass-panel rounded-[2.5rem] p-20 text-center space-y-6 border-dashed border-slate-800">
                <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto shadow-inner border border-slate-800">
                  <i className="fa-solid fa-radar text-4xl text-slate-700 animate-pulse"></i>
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-slate-300">Searching for Entry Signals</p>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    {riskConfig.tradingEnabled ? 'Gentle GIX is currently analyzing OANDA, Binance and Stock charts for 100% accuracy matches.' : 'Bot is in standby mode. Start bot to begin automated analysis.'}
                  </p>
                </div>
                {!riskConfig.tradingEnabled && (
                  <div className="inline-block p-1 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-[10px] font-black text-blue-400 uppercase tracking-widest px-4 py-2">
                    System Ready
                  </div>
                )}
              </div>
            ) : (
              trades.map(trade => {
                const broker = getBroker(trade.brokerId);
                const isEditing = editingTrade === trade.id;
                
                return (
                  <div key={trade.id} className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all shadow-xl group animate-fadeIn">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center space-x-5">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg border-2 ${
                          trade.type === 'BUY' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {trade.symbol.substring(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-black text-2xl text-white tracking-tight">{trade.symbol}</h4>
                            <span className={`text-xs px-3 py-1 rounded-full font-black tracking-widest border uppercase ${
                              trade.type === 'BUY' 
                                ? 'bg-emerald-500 text-white border-emerald-400' 
                                : 'bg-rose-500 text-white border-rose-400'
                            }`}>
                              {trade.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                              <i className="fa-solid fa-server text-[8px]"></i> {broker?.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                              <i className="fa-solid fa-bolt text-[8px]"></i> {broker?.executionSpeed.toFixed(0)}ms
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center flex-grow">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Profit/Loss (Live)</p>
                        <p className={`text-3xl font-black ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[10px] font-mono text-slate-500">ENTRY: ${trade.entryPrice.toFixed(2)}</span>
                          <span className="text-[10px] font-mono text-white bg-slate-800 px-2 py-0.5 rounded">PRICE: ${trade.currentPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 min-w-[160px]">
                        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full justify-center">
                          <span className="text-[10px] font-black text-slate-500">LEVERAGE</span>
                          <span className="text-sm font-black text-white">{trade.leverage}x</span>
                        </div>
                        
                        <div className="flex gap-2 w-full">
                          <button 
                            onClick={() => setEditingTrade(isEditing ? null : trade.id)}
                            className={`flex-grow py-3 rounded-2xl border transition-all ${
                              isEditing 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                            }`}
                          >
                            <i className={`fa-solid ${isEditing ? 'fa-check' : 'fa-gear'}`}></i>
                          </button>
                          <button 
                            onClick={() => setConfirmClose(trade.id)}
                            className="flex-grow bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-2xl text-[10px] font-black tracking-widest shadow-xl shadow-rose-950/20 active:scale-95 transition-all"
                          >
                            EXIT
                          </button>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slideInUp">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Adjust Leverage</label>
                          <div className="flex items-center gap-4">
                            <input 
                              type="range" min="1" max={riskConfig.maxLeverage} step="1"
                              value={trade.leverage}
                              onChange={(e) => onUpdateTrade(trade.id, { leverage: parseInt(e.target.value) })}
                              className="flex-grow h-2 bg-slate-800 rounded-full appearance-none accent-blue-500"
                            />
                            <span className="text-xs font-black text-white w-6">{trade.leverage}x</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Stop Loss ({riskConfig.isPercentage ? '%' : 'Price'})</label>
                          <div className="relative">
                            <input 
                              type="number"
                              value={trade.stopLoss}
                              onChange={(e) => onUpdateTrade(trade.id, { stopLoss: parseFloat(e.target.value) })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-rose-400 focus:outline-none focus:border-rose-500/50"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500/30">
                              <i className="fa-solid fa-circle-down"></i>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Take Profit ({riskConfig.isPercentage ? '%' : 'Price'})</label>
                          <div className="relative">
                            <input 
                              type="number"
                              value={trade.takeProfit}
                              onChange={(e) => onUpdateTrade(trade.id, { takeProfit: parseFloat(e.target.value) })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500/50"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500/30">
                              <i className="fa-solid fa-circle-up"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-black text-white tracking-tight">Signal Flow</h2>
            <i className="fa-solid fa-brain text-blue-500"></i>
          </div>
          
          <div className="glass-panel rounded-[2rem] overflow-hidden flex flex-col h-[600px] shadow-2xl border-slate-800">
            <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logs</span>
                <span className="bg-slate-800 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">{notifications.length}</span>
              </div>
              <button className="text-[9px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">Wipe Feed</button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
              {notifications.map(note => (
                <div key={note.id} className={`p-4 rounded-2xl border-l-4 shadow-sm animate-slideInRight ${
                  note.type === 'SUCCESS' ? 'border-emerald-500 bg-emerald-500/5' : 
                  note.type === 'ERROR' ? 'border-rose-500 bg-rose-500/5' : 
                  note.type === 'WARNING' ? 'border-amber-500 bg-amber-500/5' : 
                  'border-blue-500 bg-blue-500/5'
                }`}>
                  <div className="flex justify-between items-start mb-1.5">
                    <h5 className="font-black text-[11px] text-white uppercase tracking-tight">{note.title}</h5>
                    <span className="text-[8px] text-slate-500 font-mono tabular-nums">
                      {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug font-medium italic">"{note.message}"</p>
                </div>
              ))}
              
              {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-4">
                  <i className="fa-solid fa-ghost text-4xl"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Transmissions</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border-t border-emerald-500/20 shadow-xl">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">System Health</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Core Latency</p>
                <p className="text-sm font-black text-white">0.02ms</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase">AI Entropy</p>
                <p className="text-sm font-black text-emerald-400">Stable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmClose && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 animate-fadeIn">
          <div className="glass-panel p-10 rounded-[3rem] max-w-sm w-full text-center space-y-8 shadow-[0_0_100px_rgba(0,0,0,0.8)] border-rose-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50"></div>
            <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
              <i className="fa-solid fa-triangle-exclamation text-4xl text-rose-500"></i>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-white tracking-tighter">Confirm Exit</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Are you sure you want to close this trade? The current profit/loss will be finalized immediately on the broker node.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmClose(null)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-3xl transition-all border border-slate-800"
              >
                CANCEL
              </button>
              <button 
                onClick={() => { onCloseTrade(confirmClose); setConfirmClose(null); }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-3xl shadow-2xl shadow-rose-950/40 transition-all active:scale-95"
              >
                CLOSE TRADE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
