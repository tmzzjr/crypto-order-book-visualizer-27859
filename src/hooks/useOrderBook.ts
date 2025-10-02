
import { useState, useEffect, useRef } from "react";
import { ApiConfig, OrderBook } from "@/types/orderbook";
import { orderBookService } from "@/services/orderBookService";
import { toast } from "@/hooks/use-toast";

export const useOrderBook = (apiConfig: ApiConfig | null) => {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrderBook = async () => {
    if (!apiConfig) return;

    try {
      setError(null);
      const data = await orderBookService.fetchOrderBook(apiConfig);
      setOrderBook(data);
      setLastUpdate(Date.now());
      console.log("Order book updated:", data.symbol, data.bids.length, "bids,", data.asks.length, "asks");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar order book";
      setError(errorMessage);
      console.error("Error fetching order book:", err);
      
      toast({
        title: "Erro na atualização",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!apiConfig) {
      setOrderBook(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    
    // Primeira busca
    fetchOrderBook().finally(() => setLoading(false));

    // Configurar atualização automática a cada 5 segundos
    intervalRef.current = setInterval(fetchOrderBook, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [apiConfig]);

  return {
    orderBook,
    loading,
    error,
    lastUpdate,
    refetch: fetchOrderBook
  };
};
