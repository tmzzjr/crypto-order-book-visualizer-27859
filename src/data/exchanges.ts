export interface ExchangeConfig {
  name: string;
  value: string;
  requiresAuth: boolean;
  maxOrders: number;
  symbols: string[];
}

export const EXCHANGES: ExchangeConfig[] = [
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
    maxOrders: 1000,
    symbols: [
      "BTC-USDT", "BTC-USDC", "BTC-USD1", "ETH-USD1", "SHIB-USDT", "SHIB-USDC", "LUNC-USDT", "LUNC-USDC", "LUNA-USDT", "LUNA-USDC",
      "XRP-USDT", "XRP-USDC", "XLM-USDT", "XLM-USDC", "PEPE-USDT", "PEPE-USDC",
      "VOLTINU-USDT", "KISHU-USDT", "WEN-USDT", "VINU-USDT", "BONK-USDT", "TURBO-USDT", "TURBO-USDC"
    ]
  },
  {
    name: "KuCoin (Autenticado)",
    value: "kucoin-auth",
    requiresAuth: true,
    maxOrders: 5000,
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
    name: "Hibt",
    value: "hibt",
    requiresAuth: false,
    maxOrders: 100,
    symbols: [
      "BTC/USDT", "ETH/USDT", "XRP/USDT", "SOL/USDT", "BNB/USDT", "DOGE/USDT", "SHIB/USDT", 
      "PEPE/USDT", "BONK/USDT", "LUNC/USDT", "LUNA/USDT", "XLM/USDT", "WEN/USDT", "VINU/USDT", 
      "TURBO/USDT", "VOLT/USDT"
    ]
  },
  {
    name: "LBank",
    value: "lbank",
    requiresAuth: false,
    maxOrders: 100,
    symbols: [
      "BTC/USDT", "ETH/USDT", "XRP/USDT", "SOL/USDT", "BNB/USDT", "DOGE/USDT", "SHIB/USDT", 
      "PEPE/USDT", "BONK/USDT", "LUNC/USDT", "LUNA/USDT", "XLM/USDT", "WEN/USDT", "VINU/USDT", 
      "TURBO/USDT", "VOLT/USDT"
    ]
  },
  {
    name: "OKX",
    value: "okx",
    requiresAuth: false,
    maxOrders: 400,
    symbols: [
      "BTC-USDT", "BTC-USDC", "BTC-BRL", "SHIB-USDT", "SHIB-USDC", "SHIB-EUR", "LUNC-USDT", "LUNC-USDC", "LUNA-USDT", "LUNA-USDC",
      "XLM-USDT", "XLM-USDC", "XRP-USDT", "XRP-USDC", "XRP-EUR", "XRP-BRL", "VOLTINU-USDT", "KISHU-USDT",
      "PEPE-USDT", "PEPE-USDC", "WEN-USDT", "VINU-USDT", "BONK-USDT", "TURBO-USDT", "TURBO-USDC",
      "FLOKI-USD", "FLOKI-USDT", "USD1-USDT", "USD1-USD", "ETH-BRL"
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
      "BNBTIGERUSDT", "PEPEUSDT", "PEPEUSDC", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC", "WKCUSDT"
    ]
  },
  {
    name: "MEXC (Autenticado)",
    value: "mexc-auth",
    requiresAuth: true,
    maxOrders: 2000,
    symbols: [
      "BTCUSDT", "BTCUSDC", "BTCUSD1", "SHIBUSDT", "SHIBUSDC", "LUNCUSDT", "LUNCUSDC", "LUNAUSDT", "LUNAUSDC",
      "XLMUSDT", "XLMUSDC", "XRPUSDT", "XRPUSDC", "XRPUSD1", "ETHUSD1", "SOLUSD1", "KISHUUSDT", "VOLTINUUSDT",
      "BNBTIGERUSDT", "PEPEUSDT", "PEPEUSDC", "WENUSDT", "VINUUSDT", "BONKUSDT", "TURBOUSDT", "TURBOUSDC", "WKCUSDT"
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
      "WENUSDT", "VINUUSDT", "BONKUSDT", "KISHUUSDT", "VOLTINUUSDT", "TURBOUSDT", "TURBOUSDC",
      "SHIBEUR"
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
      "BTCUSDT", "BTCUSDC", "USD1USDT", "USD1USDC", "PEPEUSDT", "XRPUSDT"
    ]
  },
  {
    name: "NovaDAX",
    value: "novadax",
    requiresAuth: false,
    maxOrders: 100,
    symbols: [
      "BTC_BRL", "BTC_USDT", "SHIB_BRL", "SHIB_USDT", "XRP_BRL", "PEPE_BRL", "XLM_BRL"
    ]
  },
  {
    name: "XT",
    value: "xt",
    requiresAuth: false,
    maxOrders: 200,
    symbols: [
      "SHIBUSDT", "SHIBUSDC", "PEPEUSDT", "PEPEUSDC", "XRPUSDT", "XRPUSDC"
    ]
  },
  {
    name: "Deepcoin",
    value: "deepcoin",
    requiresAuth: false,
    maxOrders: 400,
    symbols: [
      "SHIB-USDT", "PEPE-USDT", "BTC-USDT"
    ]
  },
  {
    name: "BTCC",
    value: "btcc",
    requiresAuth: false,
    maxOrders: 200,
    symbols: [
      "BTCUSDT", "ETHUSDT", "XRPUSDT", "LTCUSDT", "EOSUSDT", "TRXUSDT", "LINKUSDT",
      "ADAUSDT", "DOGEUSDT", "SHIBUSDT", "PEPEUSDT", "SOLUSDT", "BNBUSDT", "MATICUSDT"
    ]
  }
];

// Helper to get symbols for a specific exchange
export const getSymbolsForExchange = (exchangeValue: string): string[] => {
  const exchange = EXCHANGES.find(ex => ex.value === exchangeValue);
  return exchange?.symbols || [];
};
