
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ApiConfig } from "@/types/orderbook";

interface SymbolSelectorProps {
  apiConfig: ApiConfig;
  onSymbolChange: (newSymbol: string) => void;
}

const EXCHANGE_SYMBOLS: { [key: string]: string[] } = {
  binance: [
    "BTCUSDT", "BTCUSDC", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
    "XRPUSDT", "XRPUSDC", "XLMUSDT", "XLMUSDC", "VOLTINUUSDT", "KISHUUSDT", 
    "BNBTIGERUSDT", "PEPEUSDT", "PEPEUSDC", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC",
    "USD1USDT", "USD1USDC"
  ],
  "binance-auth": [
    "BTCUSDT", "BTCUSDC", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
    "XRPUSDT", "XRPUSDC", "XLMUSDT", "XLMUSDC", "VOLTINUUSDT", "KISHUUSDT", 
    "BNBTIGERUSDT", "PEPEUSDT", "PEPEUSDC", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC",
    "USD1USDT", "USD1USDC"
  ],
  kucoin: [
    "BTC-USDT", "BTC-USDC", "BTC-USD1", "ETH-USD1", "SHIB-USDT", "SHIB-USDC", "SHIB-DOGE", "LUNC-USDT", "LUNC-USDC", "LUNA-USDT", "LUNA-USDC",
    "XRP-USDT", "XRP-USDC", "XLM-USDT", "XLM-USDC", "PEPE-USDT", "PEPE-USDC",
    "VOLTINU-USDT", "KISHU-USDT", "WEN-USDT", "VINU-USDT", "BONK-USDT", "TURBO-USDT", "TURBO-USDC"
  ],
  kraken: [
    "XBTUSD", "XBTUSDT", "XBTUSDC", "XBTEUR", "XBTGBP", "XBTUSD1", "SHIBUSD", "SHIBUSDT", "SHIBUSDC", "SHIBEUR", "SHIBGBP", "SHIBUSD1",
    "LUNAUSD", "LUNAUSDT", "LUNAUSDC", "LUNAEUR", "LUNAGBP", "LUNAUSD1", "XLMUSD", "XLMUSDT", "XLMUSDC", "XLMEUR", "XLMGBP", "XLMUSD1", 
    "XRPUSD", "XRPUSDT", "XRPUSDC", "XRPEUR", "XRPGBP", "XRPUSD1", "XRPCAD", "XRPAUD", "XRPRLUSD", "PEPEUSD", "PEPEUSDT", "PEPEUSDC", "PEPEEUR", "PEPEGBP", "PEPEUSD1", "PEPEAUD", "PEPECAD",
    "BONKUSD", "BONKUSDC", "BONKEUR", "BONKGBP", "BONKUSD1", "ETHUSD", "ETHUSDT", "ETHUSDC", "ETHEUR", "ETHGBP", "ETHUSD1", "SOLUSD1", "SOLUSDC"
  ],
  coinbase: [
    "BTC-USD", "SHIB-USD", "XLM-USD", "XRP-USD", "XRP-EUR",
    "PEPE-USD", "PEPE-EUR", "BONK-USD", "TURBO-USD"
  ],
  bitfinex: [
    "BTCUSD", "BTCUST", "BTCEUR", "SHIBUST", "SHIBEUR", "LUNCUSD", "LUNCEUR", "LUNAUSD", "LUNAEUR",
    "XLMUSD", "XLMEUR", "XRPUSD", "XRPEUR", "PEPEUSD", "PEPEUST", "PEPEEUR"
  ],
  bitget: [
    "BTCUSDT", "BTCUSDC", "BTCUSD1", "SHIBUSDT", "SHIBUSDC", "SHIBEUR", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
    "XLMUSDT", "XLMUSDC", "XRPUSDT", "XRPUSDC", "XRPUSD1", "VOLTINUUSDT", "KISHUUSDT",
    "PEPEUSDT", "PEPEUSDC", "PEPEEUR", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC"
  ],
  okx: [
    "BTC-USDT", "BTC-USD", "BTC-BRL", "ETH-BRL", "SHIB-USDT", "SHIB-USD", "SHIB-BRL", "SHIB-EUR", "LUNC-USDT", "LUNC-USD", "LUNA-USDT", "LUNA-USD",
    "XLM-USDT", "XLM-USD", "XLM-BRL", "XRP-USDT", "XRP-USD", "XRP-BRL", "XRP-EUR", "VOLTINU-USDT", "KISHU-USDT",
    "PEPE-USDT", "PEPE-USD", "PEPE-BRL", "WEN-USDT", "VINU-USDT", "BONK-USDT", "TURBO-USDT", "TURBO-USD",
    "FLOKI-USD", "FLOKI-USDT", "USD1-USDT", "USD1-USD"
  ],
  gateio: [
    "BTC_USDT", "BTC_USDC", "BTC_USD1", "SHIB_USDT", "SHIB_USDC", "SHIB_USD1", "LUNC_USDT", "LUNC_USDC", "LUNC_USD1", 
    "LUNA_USDT", "LUNA_USDC", "LUNA_USD1", "XLM_USDT", "XLM_USDC", "XLM_USD1", "XRP_USDT", "XRP_USDC", "XRP_USD1", 
    "VOLT_USDT", "KISHU_USDT", "PEPE_USDT", "PEPE_USDC", "PEPE_USD1", "ELON_USDT", "BABYNEIRO_USDT", "WEN_USDT", 
    "VINU_USDT", "BONK_USDT", "BONK_USD1", "WKC_USDT", "TURBO_USDT", "TURBO_USDC", "TURBO_USD1",
    "USD1_USDT", "USD1_USDC", "ETH_USDT", "ETH_USD1", "SOL_USD1"
  ],
  mexc: [
    "BTCUSDT", "BTCUSDC", "BTCUSD1", "SHIBUSDT", "SHIBUSDC", "SHIBEUR", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
    "XLMUSDT", "XLMUSDC", "XRPUSDT", "XRPUSDC", "XRPUSD1", "ETHUSD1", "SOLUSD1", "KISHUUSDT", "VOLTINUUSDT",
    "BNBTIGERUSDT", "PEPEUSDT", "PEPEUSDC", "PEPEEUR", "PEPEUSDE", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC"
  ],
  bitmart: [
    "BTC_USDT", "BTC_USDC", "SHIB_USDT", "SHIB_USDC", "LUNC_USDT", "LUNC_USDC", "LUNA_USDT", "LUNA_USDC",
    "XLM_USDT", "XLM_USDC", "XRP_USDT", "XRP_USDC", "VOLTINU_USDT", "KISHU_USDT", 
    "BNBTIGER_USDT", "PEPE_USDT", "PEPE_USDC", "SHI_USDT", "WEN_USDT", "VINU_USDT", "BONK_USDT", "TURBO_USDT", "TURBO_USDC"
  ],
  bybit: [
    "BTCUSDT", "BTCUSDC", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
    "XLMUSDT", "XLMUSDC", "XRPUSDT", "XRPUSDC", "PEPEUSDT", "PEPEUSDC",
    "WENUSDT", "VINUUSDT", "BONKUSDT", "KISHUUSDT", "VOLTINUUSDT", "TURBOUSDT", "TURBOUSDC"
  ],
  coinex: [
    "BTCUSDT", "BTCUSDC", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
    "XLMUSDT", "XLMUSDC", "XRPUSDT", "XRPUSDC", "PEPEUSDT", "PEPEUSDC",
    "WENUSDT", "VINUUSDT", "BONKUSDT", "KISHUUSDT", "VOLTINUUSDT", "TURBOUSDT", "TURBOUSDC"
  ],
  bingx: [
    "BTC-USDT", "BTC-USDC", "SHIB-USDT", "SHIB-USDC", "LUNC-USDT", "LUNC-USDC", "LUNA-USDT", "LUNA-USDC",
    "XLM-USDT", "XLM-USDC", "XRP-USDT", "XRP-USDC", "PEPE-USDT", "PEPE-USDC",
    "WEN-USDT", "VINU-USDT", "BONK-USDT", "KISHU-USDT", "VOLTINU-USDT", "TURBO-USDT", "TURBO-USDC"
  ],
  cryptocom: [
    "BTC_USDT", "BTC_USDC", "SHIB_USDT", "SHIB_USDC", "LUNC_USDT", "LUNC_USDC", "LUNA_USDT", "LUNA_USDC",
    "XLM_USDT", "XLM_USDC", "XRP_USDT", "XRP_USDC", "PEPE_USDT", "PEPE_USDC",
    "WEN_USDT", "VINU_USDT", "BONK_USDT", "KISHU_USDT", "VOLTINU_USDT", "TURBO_USDT", "TURBO_USDC"
  ],
  kcex: [
    "BTCUSDT", "BTCUSDC", "USD1USDT", "USD1USDC", "SHIBUSDT", "PEPEUSDT", "XRPUSDT"
  ],
  novadax: [
    "BTC_BRL", "BTC_USDT", "SHIB_BRL", "XRP_BRL", "PEPE_BRL", "XLM_BRL"
  ]
};

const SymbolSelector = ({ apiConfig, onSymbolChange }: SymbolSelectorProps) => {
  const [selectedSymbol, setSelectedSymbol] = useState(apiConfig.symbol);
  
  const availableSymbols = EXCHANGE_SYMBOLS[apiConfig.exchange] || [];

  useEffect(() => {
    setSelectedSymbol(apiConfig.symbol);
  }, [apiConfig.symbol, apiConfig.exchange]);

  const handleSymbolChange = (newSymbol: string) => {
    setSelectedSymbol(newSymbol);
    onSymbolChange(newSymbol);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="symbol-selector" className="text-white text-sm">
        Trocar Par de Moedas
      </Label>
      <Select value={selectedSymbol} onValueChange={handleSymbolChange}>
        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
          <SelectValue placeholder="Selecione um par" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          {availableSymbols.map((symbol) => (
            <SelectItem 
              key={symbol} 
              value={symbol} 
              className="text-white hover:bg-slate-600"
            >
              {symbol}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SymbolSelector;
