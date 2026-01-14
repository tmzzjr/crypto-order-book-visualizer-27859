
export interface ApiConfig {
  exchange: string;
  symbol: string;
  apiKey?: string;
  apiSecret?: string;
  apiPassphrase?: string;
  apiKeyVersion?: number;
  testnet?: boolean;
}

export interface OrderBookEntry {
  price: string;
  quantity: string;
  total?: string;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdateId?: number;
  symbol: string;
  timestamp: number;
}

export interface ExchangeConfig {
  name: string;
  baseUrl: string;
  testnetUrl?: string;
  requiresAuth: boolean;
  supportedSymbols: string[];
}
