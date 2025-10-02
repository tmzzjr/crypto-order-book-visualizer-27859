
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiConfig } from "@/types/orderbook";

interface CoinPrice {
  symbol: string;
  price: string;
  name: string;
  logo: string;
  priceChange24h?: string;
  priceChangePercent24h?: string;
}

interface CoinPricesProps {
  apiConfig: ApiConfig | null;
}

const CoinPrices = ({ apiConfig }: CoinPricesProps) => {
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const coins = [
    { 
      symbol: "SHIB", 
      name: "SHIBA INU", 
      logo: "https://assets.coingecko.com/coins/images/11939/small/shiba.png",
      binanceSymbol: "SHIBUSDT"
    },
    { 
      symbol: "LUNC", 
      name: "Terra Luna Classic", 
      logo: "https://assets.coingecko.com/coins/images/8284/small/luna1557227471663.png",
      binanceSymbol: "LUNCUSDT"
    },
    { 
      symbol: "BTC", 
      name: "Bitcoin", 
      logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      binanceSymbol: "BTCUSDT"
    },
    { 
      symbol: "XRP", 
      name: "XRP", 
      logo: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
      binanceSymbol: "XRPUSDT"
    },
    { 
      symbol: "XLM", 
      name: "Stellar", 
      logo: "https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png",
      binanceSymbol: "XLMUSDT"
    }
  ];

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // Criar streams para todos os símbolos
      const streams = coins.map(coin => `${coin.binanceSymbol.toLowerCase()}@ticker`).join('/');
      const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
      
      console.log("Conectando WebSocket para todos os símbolos:", wsUrl);
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket conectado para preços em tempo real");
        setLoading(false);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.data && data.data.s && data.data.c) {
            const tickerData = data.data;
            const binanceSymbol = tickerData.s; // BTCUSDT, SHIBUSDT, etc
            
            console.log("Dados recebidos para:", binanceSymbol, tickerData);
            
            // Encontrar a moeda correspondente
            const coin = coins.find(c => c.binanceSymbol === binanceSymbol);
            if (coin) {
              setPrices(prevPrices => {
                const existingIndex = prevPrices.findIndex(p => p.symbol === coin.symbol);
                const newPrice = {
                  symbol: coin.symbol,
                  name: coin.name,
                  logo: coin.logo,
                  price: parseFloat(tickerData.c).toString(),
                  priceChange24h: parseFloat(tickerData.p).toFixed(8),
                  priceChangePercent24h: parseFloat(tickerData.P).toFixed(2)
                };

                if (existingIndex >= 0) {
                  const updated = [...prevPrices];
                  updated[existingIndex] = newPrice;
                  return updated;
                } else {
                  return [...prevPrices, newPrice];
                }
              });
              
              setLastUpdate(Date.now());
            }
          }
        } catch (error) {
          console.error("Erro ao processar dados WebSocket:", error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("Erro WebSocket:", error);
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket fechado:", event.code, event.reason);
        
        // Reconectar após 3 segundos se não foi fechamento intencional
        if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Tentando reconectar WebSocket...");
            connectWebSocket();
          }, 3000);
        }
      };

    } catch (error) {
      console.error("Erro ao conectar WebSocket:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Inicializar preços padrão
    const initialPrices = coins.map(coin => ({
      symbol: coin.symbol,
      name: coin.name,
      logo: coin.logo,
      price: "Carregando...",
      priceChange24h: "0",
      priceChangePercent24h: "0"
    }));
    
    setPrices(initialPrices);
    
    // Conectar WebSocket
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const formatPrice = (price: string) => {
    if (price === "N/A" || price === "Carregando...") return price;
    const num = parseFloat(price);
    if (num >= 1) {
      return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
    } else {
      return `$${num.toFixed(12).replace(/\.?0+$/, '')}`;
    }
  };

  const getPriceChangeColor = (change: string) => {
    const num = parseFloat(change);
    if (num > 0) return "text-green-400";
    if (num < 0) return "text-red-400";
    return "text-slate-400";
  };

  const connectionStatus = wsRef.current?.readyState === WebSocket.OPEN ? "🟢 Conectado" : "🔴 Desconectado";

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            Preços Gerais dos Ativos (Tempo Real)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-slate-300 border-slate-600 text-xs">
              {connectionStatus}
            </Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              Última atualização: {new Date(lastUpdate).toLocaleTimeString()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {prices.map((coin) => (
            <div
              key={coin.symbol}
              className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-full flex-shrink-0 bg-slate-600 flex items-center justify-center">
                <img
                  src={coin.logo}
                  alt={coin.name}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.textContent = coin.symbol;
                    (target.nextElementSibling as HTMLElement)!.style.display = 'block';
                  }}
                />
                <span className="text-white text-xs font-bold" style={{ display: 'none' }}></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm truncate">{coin.name}</div>
                <div className="text-slate-400 text-xs">{coin.symbol}</div>
              </div>
              <div className="text-right">
                <div className={`font-mono text-sm font-bold ${
                  coin.price === "N/A" || coin.price === "Carregando..." ? "text-red-400" : "text-green-400"
                }`}>
                  {formatPrice(coin.price)}
                </div>
                {coin.priceChangePercent24h && coin.priceChangePercent24h !== "0" && (
                  <div className={`text-xs font-mono ${getPriceChangeColor(coin.priceChangePercent24h)}`}>
                    {parseFloat(coin.priceChangePercent24h) > 0 ? '+' : ''}{coin.priceChangePercent24h}%
                  </div>
                )}
                {loading && (
                  <div className="text-xs text-slate-500">Conectando...</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinPrices;
