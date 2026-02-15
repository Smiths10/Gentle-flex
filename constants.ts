
import { AssetType } from './types';

export const BROKERS = [
  { id: 'oanda', name: 'OANDA', type: AssetType.FOREX },
  { id: 'pepperstone', name: 'Pepperstone', type: AssetType.FOREX },
  { id: 'fxtm', name: 'FXTM', type: AssetType.FOREX },
  { id: 'ig', name: 'IG Group', type: AssetType.FOREX },
  { id: 'ib', name: 'Interactive Brokers', type: AssetType.STOCKS },
  { id: 'xm', name: 'XM', type: AssetType.FOREX },
  { id: 'fxcm', name: 'FXCM', type: AssetType.FOREX },
  { id: 'exness', name: 'Exness', type: AssetType.FOREX },
  { id: 'luno', name: 'Luno', type: AssetType.CRYPTO },
  { id: 'binance', name: 'Binance', type: AssetType.CRYPTO },
  { id: 'kucoin', name: 'KuCoin', type: AssetType.CRYPTO },
  { id: 'kraken', name: 'Kraken', type: AssetType.CRYPTO },
  { id: 'tradier', name: 'Tradier', type: AssetType.STOCKS },
];

export const ASSETS = {
  FOREX: [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD',
    'USD/CHF', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY',
    'AUD/JPY', 'EUR/AUD', 'EUR/CAD', 'GBP/CAD', 'AUD/NZD'
  ],
  STOCKS: [
    'AAPL', 'TSLA', 'NVDA', 'AMZN', 'MSFT',
    'GOOGL', 'META', 'AMD', 'NFLX', 'BRK.B',
    'V', 'JPM', 'UNH', 'WMT', 'DIS'
  ],
  CRYPTO: [
    'BTC', 'ETH', 'SOL', 'BNB', 'XRP',
    'ADA', 'DOT', 'DOGE', 'AVAX', 'LINK',
    'SHIB', 'MATIC', 'TRX', 'LTC', 'UNI'
  ]
};
