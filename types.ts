
export enum BrokerStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR'
}

export enum AssetType {
  FOREX = 'FOREX',
  CRYPTO = 'CRYPTO',
  STOCKS = 'STOCKS'
}

export interface Broker {
  id: string;
  name: string;
  type: AssetType;
  status: BrokerStatus;
  apiKey: string;
  apiSecret: string;
  balance: number;
  winRate: number;
  avgProfit: number;
  executionSpeed: number; // in ms
  errorMessage?: string;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  amount: number;
  leverage: number;
  stopLoss: number;
  takeProfit: number;
  status: 'OPEN' | 'CLOSED';
  pnl: number;
  openTime: number;
  brokerId: string;
  isAutoClosed: boolean;
}

export interface RiskConfig {
  maxLeverage: number;
  defaultStopLoss: number;
  defaultTakeProfit: number;
  isPercentage: boolean;
  tradingEnabled: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: number;
}
