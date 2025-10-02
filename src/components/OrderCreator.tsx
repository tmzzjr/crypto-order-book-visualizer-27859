
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ApiConfig } from "@/types/orderbook";
import { CreateOrderRequest } from "@/types/trading";
import { tradingService } from "@/services/tradingService";
import { toast } from "@/hooks/use-toast";

interface OrderCreatorProps {
  apiConfig: ApiConfig | null;
  currentPrice?: string;
}

const OrderCreator = ({ apiConfig, currentPrice }: OrderCreatorProps) => {
  const [orderData, setOrderData] = useState<CreateOrderRequest>({
    symbol: apiConfig?.symbol || "",
    side: "BUY",
    type: "LIMIT",
    quantity: "",
    price: currentPrice || "",
    timeInForce: "GTC"
  });
  const [isCreating, setIsCreating] = useState(false);

  const canTrade = apiConfig?.exchange === "binance-auth" && apiConfig.apiKey && apiConfig.apiSecret;

  const handleCreateOrder = async () => {
    if (!apiConfig || !canTrade) {
      toast({
        title: "Erro",
        description: "Configuração de trading não disponível ou incompleta.",
        variant: "destructive"
      });
      return;
    }

    if (!orderData.quantity || !orderData.price) {
      toast({
        title: "Erro",
        description: "Preço e quantidade são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await tradingService.createOrder(apiConfig, orderData);
      
      toast({
        title: "Ordem Criada!",
        description: `Ordem ${result.orderId} criada com sucesso.`,
      });

      console.log("Order created:", result);
      
      // Reset form
      setOrderData({
        ...orderData,
        quantity: "",
        price: currentPrice || ""
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar ordem";
      toast({
        title: "Erro na Criação",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!apiConfig) {
    return null;
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          Criar Ordem - {apiConfig.symbol}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {canTrade ? (
            "Crie ordens de compra ou venda diretamente na corretora"
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                Trading Indisponível
              </Badge>
              <span>Necessária configuração com API Key para trading</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="side" className="text-white">Tipo de Ordem</Label>
            <Select 
              value={orderData.side} 
              onValueChange={(value: "BUY" | "SELL") => setOrderData({...orderData, side: value})}
              disabled={!canTrade}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="BUY" className="text-white hover:bg-slate-600">
                  <span className="text-green-400">COMPRAR</span>
                </SelectItem>
                <SelectItem value="SELL" className="text-white hover:bg-slate-600">
                  <span className="text-red-400">VENDER</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-white">Tipo</Label>
            <Select 
              value={orderData.type} 
              onValueChange={(value: "LIMIT" | "MARKET") => setOrderData({...orderData, type: value})}
              disabled={!canTrade}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="LIMIT" className="text-white hover:bg-slate-600">LIMIT</SelectItem>
                <SelectItem value="MARKET" className="text-white hover:bg-slate-600">MARKET</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.00000001"
              placeholder="0.00000000"
              value={orderData.price}
              onChange={(e) => setOrderData({...orderData, price: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 font-mono"
              disabled={!canTrade || orderData.type === "MARKET"}
            />
            {currentPrice && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOrderData({...orderData, price: currentPrice})}
                className="text-xs text-slate-400 hover:text-white p-0 h-auto"
                disabled={!canTrade}
              >
                Usar preço atual: {parseFloat(currentPrice).toFixed(8)}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-white">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              step="0.000001"
              placeholder="0.000000"
              value={orderData.quantity}
              onChange={(e) => setOrderData({...orderData, quantity: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 font-mono"
              disabled={!canTrade}
            />
          </div>
        </div>

        {orderData.type === "LIMIT" && (
          <div className="space-y-2">
            <Label htmlFor="timeInForce" className="text-white">Time in Force</Label>
            <Select 
              value={orderData.timeInForce} 
              onValueChange={(value: "GTC" | "IOC" | "FOK") => setOrderData({...orderData, timeInForce: value})}
              disabled={!canTrade}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="GTC" className="text-white hover:bg-slate-600">GTC (Good Till Cancel)</SelectItem>
                <SelectItem value="IOC" className="text-white hover:bg-slate-600">IOC (Immediate or Cancel)</SelectItem>
                <SelectItem value="FOK" className="text-white hover:bg-slate-600">FOK (Fill or Kill)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {orderData.price && orderData.quantity && (
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <div className="text-sm text-slate-400">Total Estimado:</div>
            <div className="text-lg font-mono text-white">
              ${(parseFloat(orderData.price) * parseFloat(orderData.quantity)).toFixed(2)}
            </div>
          </div>
        )}

        <Button 
          onClick={handleCreateOrder}
          disabled={!canTrade || isCreating || !orderData.quantity || (!orderData.price && orderData.type === "LIMIT")}
          className={`w-full ${
            orderData.side === "BUY" 
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" 
              : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          }`}
        >
          {isCreating ? "Criando..." : `${orderData.side === "BUY" ? "COMPRAR" : "VENDER"} ${apiConfig.symbol}`}
        </Button>

        {!canTrade && (
          <div className="text-xs text-slate-400 text-center">
            * Para usar a funcionalidade de trading, selecione "Binance (Authenticated)" e configure sua API Key e Secret
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCreator;
