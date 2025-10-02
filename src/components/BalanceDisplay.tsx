
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApiConfig } from "@/types/orderbook";
import { Balance } from "@/types/trading";
import { tradingService } from "@/services/tradingService";
import { toast } from "@/hooks/use-toast";

interface BalanceDisplayProps {
  apiConfig: ApiConfig;
}

const BalanceDisplay = ({ apiConfig }: BalanceDisplayProps) => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = async () => {
    if (!apiConfig.apiKey || !apiConfig.apiSecret) return;

    setLoading(true);
    setError(null);

    try {
      const data = await tradingService.getBalance(apiConfig);
      // Filtrar apenas saldos de USDT, BRL e USDC com valor > 0
      const filteredBalances = data.filter(balance => 
        ['USDT', 'BRL', 'USDC'].includes(balance.asset) &&
        (parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0)
      );
      setBalances(filteredBalances);
      console.log("Filtered balances fetched:", filteredBalances.length, "assets");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar saldos";
      setError(errorMessage);
      console.error("Error fetching balances:", err);
      
      toast({
        title: "Erro ao carregar saldos",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [apiConfig]);

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-slate-700" />
          <Skeleton className="h-4 w-48 bg-slate-700" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-slate-700" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-orange-900/20 border-orange-700">
        <CardHeader>
          <CardTitle className="text-orange-400">Aviso - Saldos</CardTitle>
          <CardDescription className="text-orange-300">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          Saldos Principais
        </CardTitle>
        <CardDescription className="text-slate-400">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              {balances.length} Ativos
            </Badge>
            <span>USDT, BRL e USDC disponíveis</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {balances.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            Nenhum saldo encontrado para USDT, BRL ou USDC
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-xs font-medium text-slate-400 border-b border-slate-700 pb-2">
              <span>Ativo</span>
              <span>Disponível</span>
              <span>Bloqueado</span>
            </div>
            {balances.map((balance, index) => {
              return (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 text-sm py-2 hover:bg-slate-700/50 transition-colors font-mono"
                >
                  <span className="text-white font-semibold">{balance.asset}</span>
                  <span className="text-green-400">{parseFloat(balance.free).toFixed(8)}</span>
                  <span className="text-orange-400">{parseFloat(balance.locked).toFixed(8)}</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceDisplay;
