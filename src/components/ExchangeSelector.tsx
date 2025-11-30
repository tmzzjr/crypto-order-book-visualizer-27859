
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiConfig } from "@/types/orderbook";

interface ExchangeSelectorProps {
  currentExchange: string;
  onExchangeChange: (newExchange: string) => void;
}

const EXCHANGES = [
  {
    name: "Binance",
    value: "binance",
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
    symbols: [
      "BTC-USDT", "BTC-USDC", "BTC-USD1", "ETH-USD1", "SHIB-USDT", "SHIB-USDC", "LUNC-USDT", "LUNC-USDC", "LUNA-USDT", "LUNA-USDC",
      "XRP-USDT", "XRP-USDC", "XLM-USDT", "XLM-USDC", "PEPE-USDT", "PEPE-USDC",
      "VOLTINU-USDT", "KISHU-USDT", "WEN-USDT", "VINU-USDT", "BONK-USDT", "TURBO-USDT", "TURBO-USDC"
    ]
  },
  {
    name: "Kraken",
    value: "kraken",
    symbols: [
      "XBTUSD", "XBTUSDT", "XBTUSDC", "XBTEUR", "XBTGBP", "XBTUSD1", "SHIBUSD", "SHIBUSDT", "SHIBUSDC", "SHIBEUR", "SHIBGBP", "SHIBUSD1",
      "LUNAUSD", "LUNAUSDT", "LUNAUSDC", "LUNAEUR", "LUNAGBP", "LUNAUSD1", "XLMUSD", "XLMUSDT", "XLMUSDC", "XLMEUR", "XLMGBP", "XLMUSD1", 
      "XRPUSD", "XRPUSDT", "XRPUSDC", "XRPEUR", "XRPGBP", "XRPUSD1", "PEPEUSD", "PEPEUSDT", "PEPEUSDC", "PEPEEUR", "PEPEGBP", "PEPEUSD1", 
      "BONKUSD", "BONKUSDC", "BONKEUR", "BONKGBP", "BONKUSD1", "ETHUSD", "ETHUSDT", "ETHUSDC", "ETHEUR", "ETHGBP", "ETHUSD1", "SOLUSD1", "SOLUSDC"
    ]
  },
  {
    name: "Coinbase Pro",
    value: "coinbase",
    symbols: [
      "BTC-USD", "SHIB-USD", "XLM-USD", "XRP-USD", "XRP-EUR",
      "PEPE-USD", "PEPE-EUR", "BONK-USD", "TURBO-USD"
    ]
  },
  {
    name: "Bitfinex",
    value: "bitfinex",
    symbols: [
      "BTCUSD", "BTCUST", "BTCEUR", "SHIBUST", "SHIBEUR", "LUNCUSD", "LUNCEUR", "LUNAUSD", "LUNAEUR",
      "XLMUSD", "XLMEUR", "XRPUSD", "XRPEUR", "PEPEUSD", "PEPEUST", "PEPEEUR"
    ]
  },
  {
    name: "Bitget",
    value: "bitget",
    symbols: [
      "BTCUSDT", "BTCUSDC", "BTCUSD1", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
      "XLMUSDT", "XLMUSDC", "XRPUSDT", "XRPUSDC", "XRPUSD1", "VOLTINUUSDT", "KISHUUSDT",
      "PEPEUSDT", "PEPEUSDC", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC"
    ]
  },
  {
    name: "OKX",
    value: "okx",
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
    symbols: [
      "BTCUSDT", "BTCUSDC", "BTCUSD1", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
      "XLMUSDT", "XLMUSDC", "XRPUSDT", "XRPUSDC", "XRPUSD1", "ETHUSD1", "SOLUSD1", "KISHUUSDT", "VOLTINUUSDT",
      "BNBTIGERUSDT", "PEPEUSDT", "PEPEUSDC", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC"
    ]
  },
  {
    name: "KCex",
    value: "kcex",
    symbols: [
      "BTCUSDT", "BTCUSDC", "USD1USDT", "USD1USDC"
    ]
  }
];

const ExchangeSelector = ({ currentExchange, onExchangeChange }: ExchangeSelectorProps) => {
  const currentExchangeData = EXCHANGES.find(ex => ex.value === currentExchange);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">Corretora</label>
      <Select value={currentExchange} onValueChange={onExchangeChange}>
        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
          <SelectValue placeholder="Selecione uma corretora" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          {EXCHANGES.map((exchange) => (
            <SelectItem 
              key={exchange.value} 
              value={exchange.value} 
              className="text-white hover:bg-slate-600"
            >
              {exchange.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ExchangeSelector;
