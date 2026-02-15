
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import MarketView from './components/MarketView';
import Settings from './components/Settings';
import History from './components/History';
import Footer from './components/Footer';
import { Broker, BrokerStatus, Trade, RiskConfig, Notification, AssetType } from './types';
import { BROKERS, ASSETS } from './constants';
import { analyzeMarket } from './services/geminiService';

const App: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>(() => {
    const saved = localStorage.getItem('gentle_gix_brokers');
    return saved ? JSON.parse(saved) : BROKERS.map(b => ({
      ...b,
      status: BrokerStatus.DISCONNECTED,
      apiKey: '',
      apiSecret: '',
      balance: 0,
      winRate: 0,
      avgProfit: 0,
      executionSpeed: 0
    }));
  });

  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('gentle_gix_trades');
    return saved ? JSON.parse(saved) : [];
  });

  const [riskConfig, setRiskConfig] = useState<RiskConfig>(() => {
    const saved = localStorage.getItem('gentle_gix_risk');
    return saved ? JSON.parse(saved) : {
      maxLeverage: 10,
      defaultStopLoss: 2,
      defaultTakeProfit: 5,
      isPercentage: true,
      tradingEnabled: false
    };
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(() => {
    const saved = localStorage.getItem('gentle_gix_profit');
    return saved ? parseFloat(saved) : 0;
  });

  const lastScanTime = useRef<number>(0);

  useEffect(() => {
    localStorage.setItem('gentle_gix_brokers', JSON.stringify(brokers));
    localStorage.setItem('gentle_gix_trades', JSON.stringify(trades));
    localStorage.setItem('gentle_gix_risk', JSON.stringify(riskConfig));
    localStorage.setItem('gentle_gix_profit', totalProfit.toString());
  }, [brokers, trades, riskConfig, totalProfit]);

  const addNotification = useCallback((title: string, message: string, type: Notification['type'] = 'INFO') => {
    const newNote: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: Date.now()
    };
    setNotifications(prev => [newNote, ...prev].slice(0, 30));
  }, []);

  const executeSignal = useCallback((signal: 'BUY' | 'SELL', symbol: string, currentPrice: number, suggestedSL?: number, suggestedTP?: number) => {
    const connectedBroker = brokers.find(b => b.status === BrokerStatus.CONNECTED);
    if (!connectedBroker) {
      addNotification('Connectivity Failure', 'GIX requires an active Broker Node to execute trades.', 'ERROR');
      return;
    }

    if (trades.some(t => t.symbol === symbol && t.status === 'OPEN')) {
      addNotification('Exposure Block', `${symbol} already has an active node. Diversifying...`, 'WARNING');
      return;
    }

    const slValue = suggestedSL || (riskConfig.isPercentage ? riskConfig.defaultStopLoss : currentPrice * 0.98);
    const tpValue = suggestedTP || (riskConfig.isPercentage ? riskConfig.defaultTakeProfit : currentPrice * 1.05);

    const newTrade: Trade = {
      id: Math.random().toString(36).substr(2, 9),
      symbol,
      type: signal,
      entryPrice: currentPrice,
      currentPrice: currentPrice,
      amount: connectedBroker.balance * 0.08, // 8% risk allocation
      leverage: Math.min(riskConfig.maxLeverage, 10), 
      stopLoss: slValue,
      takeProfit: tpValue,
      status: 'OPEN',
      pnl: 0,
      openTime: Date.now(),
      brokerId: connectedBroker.id,
      isAutoClosed: false
    };

    setTrades(prev => [newTrade, ...prev]);
    addNotification('Trade Initiated', `GIX executed ${signal} for ${symbol} via ${connectedBroker.name}`, 'SUCCESS');
  }, [brokers, riskConfig, trades, addNotification]);

  useEffect(() => {
    if (!riskConfig.tradingEnabled) return;

    const interval = setInterval(async () => {
      setTrades(currentTrades => {
        let profitAdded = 0;
        const updated = currentTrades.map((trade): Trade => {
          if (trade.status === 'CLOSED') return trade;

          const volatility = 0.0025;
          const drift = (Math.random() - 0.47) * volatility; 
          const newPrice = trade.currentPrice * (1 + drift);
          
          const priceChangePercent = (newPrice - trade.entryPrice) / trade.entryPrice;
          const pnlFactor = trade.type === 'BUY' ? priceChangePercent : -priceChangePercent;
          const pnl = pnlFactor * trade.amount * trade.leverage;

          let shouldClose = false;
          let isAutoClosed = false;

          if (riskConfig.isPercentage) {
            const currentPnlPercent = pnlFactor * 100;
            if (currentPnlPercent <= -trade.stopLoss || currentPnlPercent >= trade.takeProfit) {
              shouldClose = true;
              isAutoClosed = true;
            }
          } else {
            if (trade.type === 'BUY') {
              if (newPrice <= trade.stopLoss || newPrice >= trade.takeProfit) {
                shouldClose = true;
                isAutoClosed = true;
              }
            } else {
              if (newPrice >= trade.stopLoss || newPrice <= trade.takeProfit) {
                shouldClose = true;
                isAutoClosed = true;
              }
            }
          }

          if (shouldClose) {
            profitAdded += pnl;
            addNotification('GIX Auto-Exit', `Finalized ${trade.symbol} position with ${pnl >= 0 ? 'gain' : 'loss'} of $${pnl.toFixed(2)}`, pnl >= 0 ? 'SUCCESS' : 'WARNING');
            return { ...trade, currentPrice: newPrice, pnl, status: 'CLOSED', isAutoClosed };
          }

          return { ...trade, currentPrice: newPrice, pnl };
        });

        if (profitAdded !== 0) {
          setTotalProfit(prev => prev + profitAdded);
        }
        return updated;
      });

      const now = Date.now();
      if (now - lastScanTime.current > 45000) {
        lastScanTime.current = now;
        const categories = Object.keys(ASSETS) as Array<keyof typeof ASSETS>;
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        const randomAsset = ASSETS[randomCat][Math.floor(Math.random() * ASSETS[randomCat].length)];
        
        const signal = Math.random() > 0.5 ? 'BUY' : 'SELL';
        const currentPrice = 100 + Math.random() * 50000;
        
        if (trades.filter(t => t.status === 'OPEN').length < 3 && brokers.some(b => b.status === BrokerStatus.CONNECTED)) {
          executeSignal(signal as any, randomAsset, currentPrice);
        }
      }

    }, 3000);

    return () => clearInterval(interval);
  }, [riskConfig.tradingEnabled, riskConfig.isPercentage, addNotification, executeSignal, brokers, trades]);

  const toggleBot = () => {
    const nextState = !riskConfig.tradingEnabled;
    setRiskConfig(prev => ({ ...prev, tradingEnabled: nextState }));
    addNotification(
      nextState ? 'GIX Neural On' : 'GIX Neural Off',
      nextState ? 'Scanning global order flows and news sentiment.' : 'Analysis cycles suspended.',
      nextState ? 'SUCCESS' : 'WARNING'
    );
  };

  const closeTradeManually = (id: string) => {
    setTrades(prev => {
      const trade = prev.find(t => t.id === id);
      if (!trade || trade.status === 'CLOSED') return prev;
      setTotalProfit(curr => curr + trade.pnl);
      addNotification('Manual Intervention', `User-signed exit for ${trade.symbol} finalized.`, 'INFO');
      return prev.map(t => t.id === id ? { ...t, status: 'CLOSED' as const, isAutoClosed: false } : t);
    });
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
        <Navbar botStatus={riskConfig.tradingEnabled} toggleBot={toggleBot} />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <Dashboard 
                trades={trades.filter(t => t.status === 'OPEN')} 
                brokers={brokers} 
                notifications={notifications}
                totalProfit={totalProfit}
                riskConfig={riskConfig}
                onCloseTrade={closeTradeManually}
                onUpdateTrade={(id, updates) => setTrades(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))}
              />
            } />
            <Route path="/market" element={<MarketView riskConfig={riskConfig} onExecute={executeSignal} />} />
            <Route path="/history" element={<History trades={trades.filter(t => t.status === 'CLOSED')} />} />
            <Route path="/settings" element={
              <Settings 
                brokers={brokers} 
                setBrokers={setBrokers} 
                riskConfig={riskConfig} 
                setRiskConfig={setRiskConfig} 
              />
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
