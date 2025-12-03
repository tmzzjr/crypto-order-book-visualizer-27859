import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ApiConfig } from "@/types/orderbook";
import { toast } from "@/hooks/use-toast";

interface ApiConfigurationProps {
  onSave: (config: ApiConfig) => void;
}

const EXCHANGES = [
  {
    name: "Binance",
    value: "binance",
    requiresAuth: false,
    maxOrders: 100,
    symbols: [
      "BTCUSDT", "BTCUSDC", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
      "XRPUSDT", "XRPUSDC", "XLMUSDT", "XLMUSDC", "VOLTINUUSDT", "KISHUUSDT", 
      "BNBTIGERUSDT", "PEPEUSDT", "PEPEUSDC", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC",
      "USD1USDT", "USD1USDC"
    ]
  },
  {
    name: "Binance (Authenticated)",
    value: "binance-auth",
    requiresAuth: true,
    maxOrders: 100,
    symbols: [
      "BTCUSDT", "BTCUSDC", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
      "XRPUSDT", "XRPUSDC", "XLMUSDT", "XLMUSDC", "VOLTINUUSDT", "KISHUUSDT", 
      "BNBTIGERUSDT", "PEPEUSDT", "PEPEUSDC", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC",
      "USD1USDT", "USD1USDC"
    ]
  },
  {
    name: "KuCoin",
    value: "kucoin",
    requiresAuth: false,
    maxOrders: 200,
    symbols: [
      "BTC-USDT", "BTC-USDC", "BTC-USD1", "ETH-USD1", "SHIB-USDT", "SHIB-USDC", "LUNC-USDT", "LUNC-USDC", "LUNA-USDT", "LUNA-USDC",
      "XRP-USDT", "XRP-USDC", "XLM-USDT", "XLM-USDC", "PEPE-USDT", "PEPE-USDC",
      "VOLTINU-USDT", "KISHU-USDT", "WEN-USDT", "VINU-USDT", "BONK-USDT", "TURBO-USDT", "TURBO-USDC"
    ]
  },
  {
    name: "Kraken",
    value: "kraken",
    requiresAuth: false,
    maxOrders: 500,
    symbols: [
      "XBTUSD", "XBTUSDT", "XBTUSDC", "XBTEUR", "XBTGBP", "XBTUSD1", "SHIBUSD", "SHIBUSDT", "SHIBUSDC", "SHIBEUR", "SHIBGBP", "SHIBUSD1",
      "LUNAUSD", "LUNAUSDT", "LUNAUSDC", "LUNAEUR", "LUNAGBP", "LUNAUSD1", "XLMUSD", "XLMUSDT", "XLMUSDC", "XLMEUR", "XLMGBP", "XLMUSD1", 
      "XRPUSD", "XRPUSDT", "XRPUSDC", "XRPEUR", "XRPGBP", "XRPUSD1", "XRPCAD", "XRPAUD", "XRPRLUSD", "PEPEUSD", "PEPEUSDT", "PEPEUSDC", "PEPEEUR", "PEPEGBP", "PEPEUSD1", "PEPEAUD", "PEPECAD",
      "BONKUSD", "BONKUSDC", "BONKEUR", "BONKGBP", "BONKUSD1", "ETHUSD", "ETHUSDT", "ETHUSDC", "ETHEUR", "ETHGBP", "ETHUSD1", "SOLUSD1", "SOLUSDC"
    ]
  },
  {
    name: "Coinbase Pro",
    value: "coinbase",
    requiresAuth: false,
    maxOrders: 1000,
    symbols: [
      "BTC-USD", "SHIB-USD", "XLM-USD", "XRP-USD", "XRP-EUR",
      "PEPE-USD", "PEPE-EUR", "BONK-USD", "TURBO-USD"
    ]
  },
  {
    name: "Bitfinex",
    value: "bitfinex",
    requiresAuth: false,
    maxOrders: 250,
    symbols: [
      "BTCUSD", "BTCUST", "BTCEUR", "SHIBUST", "SHIBEUR", "LUNCUSD", "LUNCEUR", "LUNAUSD", "LUNAEUR",
      "XLMUSD", "XLMEUR", "XRPUSD", "XRPEUR", "PEPEUSD", "PEPEUST", "PEPEEUR"
    ]
  },
  {
    name: "Bitget",
    value: "bitget",
    requiresAuth: false,
    maxOrders: 200,
    symbols: [
      "BTCUSDT", "BTCUSDC", "BTCUSD1", "SHIBUSDT", "SHIBUSDC", "SHIBEUR", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
      "XLMUSDT", "XLMUSDC", "XRPUSDT", "XRPUSDC", "XRPUSD1", "VOLTINUUSDT", "KISHUUSDT",
      "PEPEUSDT", "PEPEUSDC", "PEPEEUR", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC"
    ]
  },
  {
    name: "OKX",
    value: "okx",
    requiresAuth: false,
    maxOrders: 400,
    symbols: [
      "BTC-USDT", "BTC-USDC", "SHIB-USDT", "SHIB-USDC", "LUNC-USDT", "LUNC-USDC", "LUNA-USDT", "LUNA-USDC",
      "XLM-USDT", "XLM-USDC", "XRP-USDT", "XRP-USDC", "VOLTINU-USDT", "KISHU-USDT",
      "PEPE-USDT", "PEPE-USDC", "WEN-USDT", "VINU-USDT", "BONK-USDT", "TURBO-USDT", "TURBO-USDC",
      "FLOKI-USD", "FLOKI-USDT", "USD1-USDT", "USD1-USD"
    ]
  },
  {
    name: "Gate.io",
    value: "gateio",
    requiresAuth: false,
    maxOrders: 500,
    symbols: [
      "BTC_USDT", "BTC_USDC", "BTC_USD1", "SHIB_USDT", "SHIB_USDC", "SHIB_USD1", "LUNC_USDT", "LUNC_USDC", "LUNC_USD1", 
      "LUNA_USDT", "LUNA_USDC", "LUNA_USD1", "XLM_USDT", "XLM_USDC", "XLM_USD1", "XRP_USDT", "XRP_USDC", "XRP_USD1", 
      "VOLTINU_USDT", "KISHU_USDT", "PEPE_USDT", "PEPE_USDC", "PEPE_USD1", "ELON_USDT", "BABYNEIRO_USDT", "WEN_USDT", 
      "VINU_USDT", "BONK_USDT", "BONK_USD1", "WKC_USDT", "TURBO_USDT", "TURBO_USDC", "TURBO_USD1",
      "USD1_USDT", "USD1_USDC", "ETH_USDT", "ETH_USD1", "SOL_USD1"
    ]
  },
  {
    name: "MEXC",
    value: "mexc",
    requiresAuth: false,
    maxOrders: 200,
    symbols: [
      "BTCUSDT", "BTCUSDC", "BTCUSD1", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
      "XLMUSDT", "XLMUSDC", "XRPUSDT", "XRPUSDC", "XRPUSD1", "ETHUSD1", "SOLUSD1", "KISHUUSDT", "VOLTINUUSDT",
      "BNBTIGERUSDT", "PEPEUSDT", "PEPEUSDC", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC"
    ]
  },
  {
    name: "Bitmart",
    value: "bitmart",
    requiresAuth: false,
    maxOrders: 200,
    symbols: [
      "BTC_USDT", "BTC_USDC", "SHIB_USDT", "SHIB_USDC", "LUNC_USDT", "LUNC_USDC", "LUNA_USDT", "LUNA_USDC",
      "XLM_USDT", "XLM_USDC", "XRP_USDT", "XRP_USDC", "VOLTINU_USDT", "KISHU_USDT", 
      "BNBTIGER_USDT", "PEPE_USDT", "PEPE_USDC", "SHI_USDT", "WEN_USDT", "VINU_USDT", "BONK_USDT", "TURBO_USDT", "TURBO_USDC"
    ]
  },
  {
    name: "Bybit",
    value: "bybit",
    requiresAuth: false,
    maxOrders: 200,
    symbols: [
      "BTCUSDT", "BTCUSDC", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
      "XLMUSDT", "XLMUSDC", "XRPUSDT", "XRPUSDC", "PEPEUSDT", "PEPEUSDC",
      "WENUSDT", "VINUUSDT", "BONKUSDT", "KISHUUSDT", "VOLTINUUSDT", "TURBOUSDT", "TURBOUSDC"
    ]
  },
  {
    name: "CoinEx",
    value: "coinex",
    requiresAuth: false,
    maxOrders: 200,
    symbols: [
      "BTCUSDT", "BTCUSDC", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
      "XLMUSDT", "XLMUSDC", "XRPUSDT", "XRPUSDC", "PEPEUSDT", "PEPEUSDC",
      "WENUSDT", "VINUUSDT", "BONKUSDT", "KISHUUSDT", "VOLTINUUSDT", "TURBOUSDT", "TURBOUSDC"
    ]
  },
  {
    name: "BingX",
    value: "bingx",
    requiresAuth: false,
    maxOrders: 200,
    symbols: [
      "BTC-USDT", "BTC-USDC", "SHIB-USDT", "SHIB-USDC", "LUNC-USDT", "LUNC-USDC", "LUNA-USDT", "LUNA-USDC",
      "XLM-USDT", "XLM-USDC", "XRP-USDT", "XRP-USDC", "PEPE-USDT", "PEPE-USDC",
      "WEN-USDT", "VINU-USDT", "BONK-USDT", "KISHU-USDT", "VOLTINU-USDT", "TURBO-USDT", "TURBO-USDC"
    ]
  },
  {
    name: "Crypto.com",
    value: "cryptocom",
    requiresAuth: false,
    maxOrders: 150,
    symbols: [
      "BTC_USDT", "BTC_USDC", "SHIB_USDT", "SHIB_USDC", "LUNC_USDT", "LUNC_USDC", "LUNA_USDT", "LUNA_USDC",
      "XLM_USDT", "XLM_USDC", "XRP_USDT", "XRP_USDC", "PEPE_USDT", "PEPE_USDC",
      "WEN_USDT", "VINU_USDT", "BONK_USDT", "KISHU_USDT", "VOLTINU_USDT", "TURBO_USDT", "TURBO_USDC"
    ]
  },
  {
    name: "KCex",
    value: "kcex",
    requiresAuth: false,
    maxOrders: 1000,
    symbols: [
      "BTCUSDT", "BTCUSDC", "USD1USDT", "USD1USDC", "SHIBUSDT", "PEPEUSDT", "XRPUSDT"
    ]
  }
];

const ApiConfiguration = ({ onSave }: ApiConfigurationProps) => {
  const [config, setConfig] = useState<ApiConfig>({
    exchange: "",
    symbol: "",
    testnet: false
  });

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

    if (selectedExchange?.requiresAuth && (!config.apiKey || !config.apiSecret)) {
      toast({
        title: "Erro",
        description: "API Key e Secret são obrigatórios para esta corretora.",
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
            <SelectContent className="bg-slate-700 border-slate-600">
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
              <SelectContent className="bg-slate-700 border-slate-600">
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
