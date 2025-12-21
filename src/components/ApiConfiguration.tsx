import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ApiConfig } from "@/types/orderbook";
import { toast } from "@/hooks/use-toast";
import { EXCHANGES } from "@/data/exchanges";

interface ApiConfigurationProps {
  onSave: (config: ApiConfig) => void;
  initialConfig?: ApiConfig;
}

const ApiConfiguration = ({ onSave, initialConfig }: ApiConfigurationProps) => {
  const [config, setConfig] = useState<ApiConfig>({
    exchange: "",
    symbol: "",
    testnet: false
  });

  useEffect(() => {
    if (initialConfig) {
      setConfig({
        exchange: initialConfig.exchange || "",
        symbol: initialConfig.symbol || "",
        apiKey: initialConfig.apiKey,
        apiSecret: initialConfig.apiSecret,
        apiPassphrase: initialConfig.apiPassphrase,
        apiKeyVersion: initialConfig.apiKeyVersion,
        testnet: !!initialConfig.testnet
      });
    } else {
      try {
        const stored = localStorage.getItem("orderBookApiConfig");
        if (stored) {
          const parsed = JSON.parse(stored) as ApiConfig;
          setConfig({
            exchange: parsed.exchange || "",
            symbol: parsed.symbol || "",
            apiKey: parsed.apiKey,
            apiSecret: parsed.apiSecret,
            apiPassphrase: parsed.apiPassphrase,
            apiKeyVersion: parsed.apiKeyVersion,
            testnet: !!parsed.testnet
          });
        }
      } catch {
        // ignore
      }
    }
  }, [initialConfig]);

  const selectedExchange = EXCHANGES.find(ex => ex.value === config.exchange);

  const handleSave = () => {
    if (!config.exchange || !config.symbol) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma corretora e um par de moedas.",
        variant: "destructive"
      });
      return;
    }

    if (selectedExchange?.requiresAuth && (!config.apiKey || !config.apiSecret || (config.exchange === "kucoin-auth" && !config.apiPassphrase))) {
      toast({
        title: "Erro",
        description: config.exchange === "kucoin-auth" 
          ? "API Key, Secret e Passphrase são obrigatórios para KuCoin (Autenticado)." 
          : "API Key e Secret são obrigatórios para esta corretora.",
        variant: "destructive"
      });
      return;
    }

    onSave(config);
    toast({
      title: "Sucesso",
      description: "Configuração salva com sucesso!",
    });
  };

  return (
    <Card className="w-full bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Configuração da API</CardTitle>
        <CardDescription className="text-slate-400">
          Configure a conexão com a corretora de sua escolha para visualizar o order book
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="exchange" className="text-white">Corretora</Label>
          <Select 
            value={config.exchange} 
            onValueChange={(value) => setConfig({...config, exchange: value, symbol: ""})}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Selecione uma corretora" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 max-h-80">
              {EXCHANGES.map((exchange) => (
                <SelectItem key={exchange.value} value={exchange.value} className="text-white hover:bg-slate-600">
                  <div className="flex flex-col">
                    <span>{exchange.name}</span>
                    <span className="text-xs text-slate-400">Até {exchange.maxOrders} ordens</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {config.exchange && (
          <div className="space-y-2">
            <Label htmlFor="symbol" className="text-white">Par de Moedas</Label>
            <Select 
              value={config.symbol} 
              onValueChange={(value) => setConfig({...config, symbol: value})}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Selecione um par de moedas" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 max-h-80">
                {selectedExchange?.symbols.map((symbol) => (
                  <SelectItem key={symbol} value={symbol} className="text-white hover:bg-slate-600">
                    {symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedExchange?.requiresAuth && (
          <>
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-white">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Sua API Key"
                value={config.apiKey || ""}
                onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiSecret" className="text-white">API Secret</Label>
              <Input
                id="apiSecret"
                type="password"
                placeholder="Seu API Secret"
                value={config.apiSecret || ""}
                onChange={(e) => setConfig({...config, apiSecret: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {config.exchange === "kucoin-auth" && (
              <div className="space-y-2">
                <Label htmlFor="apiPassphrase" className="text-white">Passphrase</Label>
                <Input
                  id="apiPassphrase"
                  type="password"
                  placeholder="Sua Passphrase da KuCoin"
                  value={config.apiPassphrase || ""}
                  onChange={(e) => setConfig({...config, apiPassphrase: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            )}
          </>
        )}

        {config.exchange === "binance" || config.exchange === "binance-auth" ? (
          <div className="flex items-center space-x-2">
            <Switch
              id="testnet"
              checked={config.testnet}
              onCheckedChange={(checked) => setConfig({...config, testnet: checked})}
            />
            <Label htmlFor="testnet" className="text-white">Usar Testnet</Label>
          </div>
        ) : null}

        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
        >
          Conectar e Visualizar Order Book
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiConfiguration;
