
import React from 'react';
import { Trade } from '../types';

interface HistoryProps {
  trades: Trade[];
}

const History: React.FC<HistoryProps> = ({ trades }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <i className="fa-solid fa-clock-rotate-left text-amber-500"></i> Trade Log
      </h2>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Asset / Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Executed Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Entry / Exit</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Lev.</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">P&L ($)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-500 italic">
                    No trade history found. Start GIX to begin recording performance.
                  </td>
                </tr>
              ) : (
                [...trades].reverse().map(trade => (
                  <tr key={trade.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{trade.symbol}</div>
                      <div className={`text-[10px] font-black uppercase ${trade.type === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trade.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(trade.openTime).toLocaleDateString()}
                      <br />
                      {new Date(trade.openTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">
                      <div className="text-slate-500">${trade.entryPrice.toFixed(2)}</div>
                      <div className="text-white">${trade.currentPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{trade.leverage}x</td>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        trade.isAutoClosed ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {trade.isAutoClosed ? 'Auto Exit' : 'Manual'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
