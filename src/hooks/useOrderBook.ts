import { useState, useEffect, useRef, useCallback } from "react";
import { ApiConfig, OrderBook } from "@/types/orderbook";
import { orderBookService } from "@/services/orderBookService";
import { toast } from "@/hooks/use-toast";

const MAX_CONSECUTIVE_ERRORS = 3;

export const useOrderBook = (apiConfig: ApiConfig | null) => {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const consecutiveErrorsRef = useRef(0);
  const lastToastTimeRef = useRef(0);

  const fetchOrderBook = useCallback(async () => {
    if (!apiConfig) return;

    try {
      setError(null);
      const data = await orderBookService.fetchOrderBook(apiConfig);
      setOrderBook(data);
      setLastUpdate(Date.now());
      // Reset error counter on success
      consecutiveErrorsRef.current = 0;
      console.log("Order book updated:", data.symbol, data.bids.length, "bids,", data.asks.length, "asks");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar order book";
      consecutiveErrorsRef.current += 1;
      console.error(`Error fetching order book (attempt ${consecutiveErrorsRef.current}):`, err);

      // Only show error and set error state after multiple consecutive failures
      if (consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) {
        setError(errorMessage);

        // Throttle toast: at most once every 10 seconds
        const now = Date.now();
        if (now - lastToastTimeRef.current > 10000) {
          lastToastTimeRef.current = now;
          toast({
            title: "Erro na atualização",
            description: errorMessage,
            variant: "destructive"
          });
        }
      }
      // Keep previous orderBook data – don't clear it on transient errors
    }
  }, [apiConfig]);

  useEffect(() => {
    if (!apiConfig) {
      setOrderBook(null);
      setLoading(false);
      setError(null);
      consecutiveErrorsRef.current = 0;
      return;
    }

    setLoading(true);
    consecutiveErrorsRef.current = 0;
    
    // Primeira busca
    fetchOrderBook().finally(() => setLoading(false));

    // Configurar atualização automática a cada 2 segundos
    intervalRef.current = setInterval(fetchOrderBook, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [apiConfig, fetchOrderBook]);

  return {
    orderBook,
    loading,
    error,
    lastUpdate,
    refetch: fetchOrderBook
  };
};
