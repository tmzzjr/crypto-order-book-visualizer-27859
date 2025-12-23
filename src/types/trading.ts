
export interface CreateOrderRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET';
  quantity: string;
  price?: string;
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
}

export interface OrderResponse {
  orderId: string;
  symbol: string;
  side: string;
  type: string;
  quantity: string;
  price: string;
  status: string;
  transactTime: number;
}

export interface Balance {
  asset: string;
  free: string;
  locked: string;
}

export interface AutoSellSettings {
  enabled: boolean;
  exchange: string;
  symbol: string;
  type: 'LIMIT' | 'MARKET';
  targetPrice?: string;
  quantityPercent?: number;
  fixedQuantity?: string;
}
