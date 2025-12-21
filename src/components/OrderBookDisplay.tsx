
import { useOrderBook } from "@/hooks/useOrderBook";
import { ApiConfig } from "@/types/orderbook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import BalanceDisplay from "./BalanceDisplay";
import SymbolSelector from "./SymbolSelector";
import CoinPrices from "./CoinPrices";
import ExchangeSelector from "./ExchangeSelector";

interface OrderBookDisplayProps {
  apiConfig: ApiConfig | null;
  onSymbolChange: (newSymbol: string) => void;
  onExchangeChange: (newExchange: string) => void;
}

const OrderBookDisplay = ({ apiConfig, onSymbolChange, onExchangeChange }: OrderBookDisplayProps) => {
  const { orderBook, loading, error, lastUpdate } = useOrderBook(apiConfig);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full bg-slate-700" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-slate-700" />
              <Skeleton className="h-4 w-48 bg-slate-700" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full bg-slate-700" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-slate-700" />
              <Skeleton className="h-4 w-48 bg-slate-700" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full bg-slate-700" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-700">
        <CardHeader>
          <CardTitle className="text-red-400">Erro na Conexão</CardTitle>
          <CardDescription className="text-red-300">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!orderBook) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Aguardando dados...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num >= 1) {
      return num.toFixed(8);
    } else if (num >= 0.001) {
      return num.toFixed(12);
    } else {
      return num.toFixed(18).replace(/\.?0+$/, '');
    }
  };

  const formatQuantity = (quantity: string) => {
    const num = parseFloat(quantity);
    if (num >= 1000) {
      return num.toFixed(2);
    } else if (num >= 1) {
      return num.toFixed(6);
    } else {
      return num.toFixed(8);
    }
  };

  const bestBid = orderBook.bids.length > 0 ? orderBook.bids[0].price : null;
  const bestAsk = orderBook.asks.length > 0 ? orderBook.asks[0].price : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Order Book - {orderBook.symbol}
        </h2>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-slate-300 border-slate-600">
            Total: {orderBook.bids.length} bids, {orderBook.asks.length} asks
          </Badge>
          <Badge variant="outline" className="text-slate-300 border-slate-600">
            Última atualização: {new Date(lastUpdate).toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Exchange and Symbol Selectors */}
      {apiConfig && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExchangeSelector 
                currentExchange={apiConfig.exchange} 
                onExchangeChange={onExchangeChange}
              />
              <SymbolSelector 
                apiConfig={apiConfig} 
                onSymbolChange={onSymbolChange}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Balance Display for authenticated exchanges */}
      {apiConfig?.exchange === "binance-auth" && (
        <BalanceDisplay apiConfig={apiConfig} />
      )}

      {/* Coin Prices Section */}
      <CoinPrices apiConfig={apiConfig} />

      {/* Order Book Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asks (Vendas) */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              Asks (Vendas) - {orderBook.asks.length} ordens
            </CardTitle>
            <CardDescription className="text-slate-400">
              Ordens de venda ordenadas por preço (menor para maior)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-slate-400 border-b border-slate-700 pb-2">
                <span>Preço</span>
                <span>Quantidade</span>
                <span>Total</span>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 pr-4">
                  {orderBook.asks.map((ask, index) => {
                    const total = (parseFloat(ask.price) * parseFloat(ask.quantity)).toFixed(2);
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 text-sm py-1 hover:bg-slate-700/50 transition-colors font-mono"
                      >
                        <span className="text-red-400">{formatPrice(ask.price)}</span>
                        <span className="text-slate-300">{formatQuantity(ask.quantity)}</span>
                        <span className="text-slate-400">${total}</span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              {/* Totais Asks */}
              <div className="border-t border-slate-700 pt-3 mt-3">
                <div className="grid grid-cols-3 gap-4 text-sm font-semibold">
                  <span className="text-slate-400">TOTAL:</span>
                  <span className="text-red-400">
                    {orderBook.asks.reduce((sum, ask) => sum + parseFloat(ask.quantity), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                  </span>
                  <span className="text-red-400">
                    ${orderBook.asks.reduce((sum, ask) => sum + (parseFloat(ask.price) * parseFloat(ask.quantity)), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bids (Compras) */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Bids (Compras) - {orderBook.bids.length} ordens
            </CardTitle>
            <CardDescription className="text-slate-400">
              Ordens de compra ordenadas por preço (maior para menor)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-slate-400 border-b border-slate-700 pb-2">
                <span>Preço</span>
                <span>Quantidade</span>
                <span>Total</span>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 pr-4">
                  {orderBook.bids.map((bid, index) => {
                    const total = (parseFloat(bid.price) * parseFloat(bid.quantity)).toFixed(2);
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 text-sm py-1 hover:bg-slate-700/50 transition-colors font-mono"
                      >
                        <span className="text-green-400">{formatPrice(bid.price)}</span>
                        <span className="text-slate-300">{formatQuantity(bid.quantity)}</span>
                        <span className="text-slate-400">${total}</span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              {/* Totais Bids */}
              <div className="border-t border-slate-700 pt-3 mt-3">
                <div className="grid grid-cols-3 gap-4 text-sm font-semibold">
                  <span className="text-slate-400">TOTAL:</span>
                  <span className="text-green-400">
                    {orderBook.bids.reduce((sum, bid) => sum + parseFloat(bid.quantity), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                  </span>
                  <span className="text-green-400">
                    ${orderBook.bids.reduce((sum, bid) => sum + (parseFloat(bid.price) * parseFloat(bid.quantity)), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spread Info */}
      {orderBook.asks.length > 0 && orderBook.bids.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-slate-400">Melhor Bid</div>
                <div className="text-lg font-mono text-green-400">
                  {formatPrice(orderBook.bids[0].price)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Spread</div>
                <div className="text-lg font-mono text-yellow-400">
                  {formatPrice((parseFloat(orderBook.asks[0].price) - parseFloat(orderBook.bids[0].price)).toString())}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Melhor Ask</div>
                <div className="text-lg font-mono text-red-400">
                  {formatPrice(orderBook.asks[0].price)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderBookDisplay;
