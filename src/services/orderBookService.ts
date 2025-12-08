import { ApiConfig, OrderBook, OrderBookEntry } from "@/types/orderbook";

class OrderBookService {
  private baseUrls = {
    binance: "https://api.binance.com/api/v3",
    "binance-testnet": "https://testnet.binance.vision/api/v3",
    kucoin: "https://api.allorigins.win/get?url=",
    kcex: "https://api.allorigins.win/get?url=",
    kraken: "https://api.kraken.com/0/public",
    coinbase: "https://api.exchange.coinbase.com",
    bitfinex: "https://api.allorigins.win/get?url=",
    mexc: "https://api.allorigins.win/get?url=",
    bitget: "https://api.bitget.com/api/v2/spot/market",
    okx: "https://www.okx.com/api/v5/market",
    gateio: "https://api.allorigins.win/get?url=",
    bitmart: "https://api.allorigins.win/get?url=",
    bybit: "https://api.bybit.com/v5/market",
    coinex: "https://api.allorigins.win/get?url=",
    bingx: "https://api.allorigins.win/get?url=",
    cryptocom: "https://api.allorigins.win/get?url=",
    novadax: "https://api.allorigins.win/get?url=",
    xt: "https://api.allorigins.win/get?url=",
    btcc: "https://api.allorigins.win/get?url=",
    deepcoin: "https://api.allorigins.win/get?url="
  };

  async fetchOrderBook(config: ApiConfig): Promise<OrderBook> {
    console.log("Fetching order book for:", config);

    switch (config.exchange) {
      case "binance":
      case "binance-auth":
        return this.fetchBinanceOrderBook(config);
      case "kucoin":
        return this.fetchKucoinOrderBook(config);
      case "kcex":
        return this.fetchKcexOrderBook(config);
      case "kraken":
        return this.fetchKrakenOrderBook(config);
      case "coinbase":
        return this.fetchCoinbaseOrderBook(config);
      case "bitfinex":
        return this.fetchBitfinexOrderBook(config);
      case "mexc":
        return this.fetchMexcOrderBook(config);
      case "bitget":
        return this.fetchBitgetOrderBook(config);
      case "okx":
        return this.fetchOkxOrderBook(config);
      case "gateio":
        return this.fetchGateioOrderBook(config);
      case "bitmart":
        return this.fetchBitmartOrderBook(config);
      case "bybit":
        return this.fetchBybitOrderBook(config);
      case "coinex":
        return this.fetchCoinexOrderBook(config);
      case "bingx":
        return this.fetchBingxOrderBook(config);
      case "cryptocom":
        return this.fetchCryptocomOrderBook(config);
      case "novadax":
        return this.fetchNovadaxOrderBook(config);
      case "xt":
        return this.fetchXtOrderBook(config);
      case "btcc":
        return this.fetchBtccOrderBook(config);
      case "deepcoin":
        return this.fetchDeepcoinOrderBook(config);
      default:
        throw new Error(`Exchange ${config.exchange} não suportada`);
    }
  }

  private async fetchBinanceOrderBook(config: ApiConfig): Promise<OrderBook> {
    const baseUrl = config.testnet 
      ? this.baseUrls["binance-testnet"] 
      : this.baseUrls.binance;
    
    const url = `${baseUrl}/depth?symbol=${config.symbol}&limit=100`;
    
    try {
      console.log("Fetching from URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Erro da API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Raw API response:", data);

      return this.transformBinanceData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchBinanceOrderBook:", error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Erro de conexão - verifique sua internet");
      }
      
      throw error;
    }
  }

  private async fetchKucoinOrderBook(config: ApiConfig): Promise<OrderBook> {
    // Corrigir mapeamento do símbolo - incluindo LUNA e TURBO
    let symbol = config.symbol;
    if (symbol === "LUNC-USDT") {
      symbol = "LUNC-USDT"; // Manter como LUNC
    } else if (symbol === "LUNC-USDC") {
      symbol = "LUNC-USDC"; // Manter como LUNC
    } else if (symbol === "LUNA-USDT") {
      symbol = "LUNA-USDT"; // LUNA clássica
    } else if (symbol === "LUNA-USDC") {
      symbol = "LUNA-USDC"; // LUNA clássica
    } else if (symbol === "VOLTINU-USDT") {
      symbol = "VOLT-USDT";
    } else if (symbol === "TURBO-USDT") {
      symbol = "TURBO-USDT";
    } else if (symbol === "TURBO-USDC") {
      symbol = "TURBO-USDC";
    }
    
    // Usar level2_100 - máximo sem autenticação (v3 requer API key)
    const originalUrl = `https://api.kucoin.com/api/v1/market/orderbook/level2_100?symbol=${symbol}`;
    const url = `${this.baseUrls.kucoin}${encodeURIComponent(originalUrl)}`;
    
    try {
      console.log("Fetching from KuCoin URL:", url);
      console.log("Mapped symbol:", symbol);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("KuCoin API Error:", errorText);
        throw new Error(`Erro da API KuCoin: ${response.status} - ${errorText}`);
      }

      const proxyData = await response.json();
      
      if (!proxyData.contents) {
        throw new Error("Dados inválidos da API KuCoin - resposta vazia");
      }
      
      const data = JSON.parse(proxyData.contents);
      console.log("KuCoin API response:", data);
      console.log("KuCoin bids count:", data.data?.bids?.length || 0);
      console.log("KuCoin asks count:", data.data?.asks?.length || 0);

      // Check for API error response
      if (data.code && data.code !== "200000") {
        throw new Error(`Erro KuCoin: ${data.msg || data.code}`);
      }

      if (!data.data || !data.data.bids || !data.data.asks) {
        throw new Error(`Dados inválidos da API KuCoin: ${JSON.stringify(data).substring(0, 200)}`);
      }

      return this.transformKucoinData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchKucoinOrderBook:", error);
      if (error instanceof SyntaxError) {
        throw new Error("Erro ao processar dados da KuCoin - formato inválido");
      }
      throw error;
    }
  }

  private async fetchKcexOrderBook(config: ApiConfig): Promise<OrderBook> {
    // KCex symbol mapping - uses underscore format like BTC_USDT
    const symbol = config.symbol.includes('_') ? config.symbol : config.symbol.replace(/([A-Z]+)(USDT|USDC)$/, '$1_$2');
    
    // Try multiple proxy services for KCex
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(`https://api.kcex.com/sapi/v1/depth?symbol=${symbol}&limit=1000`)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://api.kcex.com/sapi/v1/depth?symbol=${symbol}&limit=1000`)}`,
      `${this.baseUrls.kcex}${encodeURIComponent(`https://api.kcex.com/sapi/v1/depth?symbol=${symbol}&limit=1000`)}`
    ];
    
    let lastError: Error | null = null;
    
    for (const url of proxies) {
      try {
        console.log("Fetching from KCex URL:", url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const responseData = await response.json();
        
        // Handle different proxy response formats
        let data = responseData;
        if (responseData.contents) {
          // allorigins format
          if (typeof responseData.contents === 'string') {
            if (responseData.contents.toLowerCase().includes('<html') || responseData.contents.includes('403')) {
              throw new Error("Proxy blocked");
            }
            data = JSON.parse(responseData.contents);
          } else {
            data = responseData.contents;
          }
        }
        
        console.log("KCex API response:", data);

        if (data.bids && data.asks) {
          return this.transformKcexData(data, config.symbol);
        }
        
        throw new Error("Invalid data structure");
      } catch (error) {
        console.error(`KCex proxy failed (${url}):`, error);
        lastError = error as Error;
        continue;
      }
    }
    
    throw new Error(`Erro ao conectar com KCex. O par ${config.symbol} pode não estar disponível.`);
  }

  private async fetchKrakenOrderBook(config: ApiConfig): Promise<OrderBook> {
    // Mapear símbolos específicos do Kraken - mudando LUNC para LUNA
    const krakenSymbolMap: { [key: string]: string } = {
      'LUNAUSD': 'LUNAUSD',
      'LUNAUSDT': 'LUNAUSDT', 
      'LUNAEUR': 'LUNAEUR'
    };
    
    const krakenSymbol = krakenSymbolMap[config.symbol] || config.symbol;
    const url = `${this.baseUrls.kraken}/Depth?pair=${krakenSymbol}&count=500`;
    
    try {
      console.log("Fetching from Kraken URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Kraken API Error:", errorText);
        throw new Error(`Erro da API Kraken: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Kraken API response:", data);

      if (data.error && data.error.length > 0) {
        throw new Error(`Erro Kraken: ${data.error.join(', ')}`);
      }

      return this.transformKrakenData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchKrakenOrderBook:", error);
      throw error;
    }
  }

  private async fetchCoinbaseOrderBook(config: ApiConfig): Promise<OrderBook> {
    const url = `${this.baseUrls.coinbase}/products/${config.symbol}/book?level=2`;
    
    try {
      console.log("Fetching from Coinbase URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Coinbase API Error:", errorText);
        throw new Error(`Erro da API Coinbase: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Coinbase API response:", data);

      return this.transformCoinbaseData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchCoinbaseOrderBook:", error);
      throw error;
    }
  }

  private async fetchBitfinexOrderBook(config: ApiConfig): Promise<OrderBook> {
    // Mapeamento correto dos símbolos para Bitfinex - incluindo LUNA e TURBO
    const bitfinexSymbolMap: { [key: string]: string } = {
      'SHIB-USDT': 'SHIBUSD',
      'SHIB-USD': 'SHIBUSD',
      'SHIBUSDT': 'SHIBUSD',
      'SHIBUST': 'SHIBUSD',
      'LUNC-USDT': 'LUNCUSD',
      'LUNC-USD': 'LUNCUSD',
      'LUNCUSDT': 'LUNCUSD',
      'LUNCUSD': 'LUNCUSD',
      'LUNA-USDT': 'LUNAUSD',
      'LUNA-USD': 'LUNAUSD',
      'LUNAUSDT': 'LUNAUSD',
      'LUNAUSD': 'LUNAUSD',
      'PEPE-USDT': 'PEPEUSD',
      'PEPE-USD': 'PEPEUSD',
      'PEPEUSDT': 'PEPEUSD',
      'PEPEUST': 'PEPEUSD'
    };
    
    const bitfinexSymbol = bitfinexSymbolMap[config.symbol] || config.symbol.replace('-', '').replace('USDT', 'USD');
    const originalUrl = `https://api-pub.bitfinex.com/v2/book/t${bitfinexSymbol}/P0?len=250`;
    const url = `${this.baseUrls.bitfinex}${encodeURIComponent(originalUrl)}`;
    
    try {
      console.log("Fetching from Bitfinex URL:", url);
      console.log("Mapped symbol:", bitfinexSymbol);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Bitfinex API Error:", errorText);
        throw new Error(`Erro da API Bitfinex: ${response.status} - ${errorText}`);
      }

      const proxyData = await response.json();
      
      if (!proxyData.contents) {
        throw new Error("Dados inválidos da API Bitfinex - resposta vazia");
      }
      
      const data = JSON.parse(proxyData.contents);
      console.log("Bitfinex API response:", data);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Dados inválidos da API Bitfinex - formato incorreto");
      }

      return this.transformBitfinexData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchBitfinexOrderBook:", error);
      throw error;
    }
  }

  private async fetchMexcOrderBook(config: ApiConfig): Promise<OrderBook> {
    // Mapear símbolos específicos para MEXC
    const mexcSymbolMap: { [key: string]: string } = {
      'VOLTINUUSDT': 'VOLTINUUSDT',
      'VOLTINU-USDT': 'VOLTINUUSDT',
      'VOLTINU_USDT': 'VOLTINUUSDT',
      'SHIBUSDT': 'SHIBUSDT',
      'LUNCUSDT': 'LUNCUSDT',
      'LUNAUSDT': 'LUNAUSDT',
      'TURBOUSDT': 'TURBOUSDT'
    };
    
    const mexcSymbol = mexcSymbolMap[config.symbol] || config.symbol;
    const originalUrl = `https://api.mexc.com/api/v3/depth?symbol=${mexcSymbol}&limit=200`;
    const url = `${this.baseUrls.mexc}${encodeURIComponent(originalUrl)}`;
    
    try {
      console.log("Fetching from MEXC URL:", url);
      console.log("Mapped symbol for MEXC:", mexcSymbol);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("MEXC API Error:", errorText);
        throw new Error(`Erro da API MEXC: ${response.status} - ${errorText}`);
      }

      const proxyData = await response.json();
      
      if (!proxyData.contents) {
        throw new Error("Dados inválidos da API MEXC - resposta vazia");
      }
      
      const data = JSON.parse(proxyData.contents);
      console.log("MEXC API response:", data);

      // Verificar diferentes formatos de resposta da MEXC
      if (data.code && data.code !== 200) {
        console.error("MEXC API error code:", data);
        throw new Error(`Erro da API MEXC: ${data.msg || 'Código de erro ' + data.code}`);
      }

      // Verificar se há dados válidos
      if (!data || typeof data !== 'object') {
        throw new Error("Dados inválidos da API MEXC - resposta não é um objeto");
      }

      // Verificar diferentes estruturas possíveis
      let bids = [];
      let asks = [];

      if (data.bids && data.asks) {
        // Formato padrão
        bids = data.bids;
        asks = data.asks;
      } else if (data.data && data.data.bids && data.data.asks) {
        // Formato com wrapper data
        bids = data.data.bids;
        asks = data.data.asks;
      } else if (data.result && data.result.bids && data.result.asks) {
        // Formato com wrapper result
        bids = data.result.bids;
        asks = data.result.asks;
      } else {
        console.error("MEXC response structure:", Object.keys(data));
        throw new Error("Dados inválidos da API MEXC - estrutura não reconhecida");
      }

      if (!Array.isArray(bids) || !Array.isArray(asks)) {
        throw new Error("Dados inválidos da API MEXC - bids ou asks não são arrays");
      }

      if (bids.length === 0 && asks.length === 0) {
        throw new Error("Dados inválidos da API MEXC - order book vazio");
      }

      return this.transformMexcData({ bids, asks }, config.symbol);
    } catch (error) {
      console.error("Error in fetchMexcOrderBook:", error);
      if (error instanceof SyntaxError) {
        throw new Error("Erro ao processar dados da MEXC - formato inválido");
      }
      throw error;
    }
  }

  private async fetchBitgetOrderBook(config: ApiConfig): Promise<OrderBook> {
    const url = `${this.baseUrls.bitget}/orderbook?symbol=${config.symbol}&type=step0&limit=200`;
    
    try {
      console.log("Fetching from Bitget URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Bitget API Error:", errorText);
        throw new Error(`Erro da API Bitget: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Bitget API response:", data);

      return this.transformBitgetData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchBitgetOrderBook:", error);
      throw error;
    }
  }

  private async fetchOkxOrderBook(config: ApiConfig): Promise<OrderBook> {
    // Mapear símbolos USDC para USD na OKX - incluindo USD1
    let symbol = config.symbol;
    if (symbol.includes('-USDC')) {
      symbol = symbol.replace('-USDC', '-USD');
    }
    
    const url = `${this.baseUrls.okx}/books?instId=${symbol}&sz=400`;
    
    try {
      console.log("Fetching from OKX URL:", url);
      console.log("Mapped symbol for OKX:", symbol);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("OKX API Error:", errorText);
        throw new Error(`Erro da API OKX: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("OKX API response:", data);

      return this.transformOkxData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchOkxOrderBook:", error);
      throw error;
    }
  }

  private async fetchGateioOrderBook(config: ApiConfig): Promise<OrderBook> {
    // Mapear símbolos específicos para Gate.io - corrigindo LUNC
    const gateioSymbolMap: { [key: string]: string } = {
      'LUNC-USDT': 'LUNC_USDT',
      'LUNC-USDC': 'LUNC_USDT', // Gate.io usa USDT para LUNC, não USDC
      'LUNA-USDT': 'LUNA_USDT',
      'LUNA-USDC': 'LUNA_USDT', // Gate.io usa USDT para LUNA, não USDC
      'BTC-USDT': 'BTC_USDT',
      'BTC-USDC': 'BTC_USDT',
      'SHIB-USDT': 'SHIB_USDT',
      'SHIB-USDC': 'SHIB_USDT',
      'XRP-USDT': 'XRP_USDT',
      'XRP-USDC': 'XRP_USDT',
      'XLM-USDT': 'XLM_USDT',
      'XLM-USDC': 'XLM_USDT',
      'PEPE-USDT': 'PEPE_USDT',
      'PEPE-USDC': 'PEPE_USDT',
      'TURBO-USDT': 'TURBO_USDT',
      'TURBO-USDC': 'TURBO_USDT',
      'USD1-USDT': 'USD1_USDT',
      'USD1-USDC': 'USD1_USDT'
    };
    
    const gateioSymbol = gateioSymbolMap[config.symbol] || config.symbol;
    const originalUrl = `https://api.gateio.ws/api/v4/spot/order_book?currency_pair=${gateioSymbol}&limit=500`;
    const url = `${this.baseUrls.gateio}${encodeURIComponent(originalUrl)}`;
    
    try {
      console.log("Fetching from Gate.io URL:", url);
      console.log("Original symbol:", config.symbol, "Mapped to:", gateioSymbol);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gate.io API Error:", errorText);
        throw new Error(`Erro da API Gate.io: ${response.status} - ${errorText}`);
      }

      const proxyData = await response.json();
      
      if (!proxyData.contents) {
        throw new Error("Dados inválidos da API Gate.io - resposta vazia");
      }
      
      const data = JSON.parse(proxyData.contents);
      console.log("Gate.io API response:", data);

      // Verificar se há erro na resposta da Gate.io
      if (data.label && data.message) {
        console.error("Gate.io API error:", data);
        throw new Error(`Erro Gate.io: ${data.message} (${data.label})`);
      }

      // Verificar se os dados estão presentes
      if (!data.asks || !data.bids) {
        console.error("Gate.io missing order book data:", data);
        throw new Error("Dados inválidos da API Gate.io - sem order book");
      }

      return this.transformGateioData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchGateioOrderBook:", error);
      throw error;
    }
  }

  private async fetchBitmartOrderBook(config: ApiConfig): Promise<OrderBook> {
    // Mapeamento correto para símbolos específicos da Bitmart - incluindo LUNA e TURBO
    const bitmartSymbolMap: { [key: string]: string } = {
      'BNBTIGERUSDT': 'BNBTIGER_USDT',
      'BNBTIGER_USDT': 'BNBTIGER_USDT',
      'BTC_USDT': 'BTC_USDT',
      'BTC_USDC': 'BTC_USDC',
      'SHIB_USDT': 'SHIB_USDT',
      'SHIB_USDC': 'SHIB_USDC',
      'LUNC_USDT': 'LUNC_USDT',
      'LUNC_USDC': 'LUNC_USDC',
      'LUNA_USDT': 'LUNA_USDT',
      'LUNA_USDC': 'LUNA_USDC',
      'XLM_USDT': 'XLM_USDT',
      'XLM_USDC': 'XLM_USDC',
      'XRP_USDT': 'XRP_USDT',
      'XRP_USDC': 'XRP_USDC',
      'VOLTINU_USDT': 'VOLTINU_USDT',
      'KISHU_USDT': 'KISHU_USDT',
      'PEPE_USDT': 'PEPE_USDT',
      'PEPE_USDC': 'PEPE_USDC',
      'SHI_USDT': 'SHI_USDT',
      'WEN_USDT': 'WEN_USDT',
      'VINU_USDT': 'VINU_USDT',
      'BONK_USDT': 'BONK_USDT',
      'TURBO_USDT': 'TURBO_USDT',
      'TURBO_USDC': 'TURBO_USDC'
    };
    
    const symbol = bitmartSymbolMap[config.symbol] || config.symbol;
    const originalUrl = `https://api-cloud.bitmart.com/spot/v1/symbols/book?symbol=${symbol}&size=200`;
    const url = `${this.baseUrls.bitmart}${encodeURIComponent(originalUrl)}`;
    
    try {
      console.log("Fetching from Bitmart URL:", url);
      console.log("Mapped symbol:", symbol);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Bitmart API Error:", errorText);
        throw new Error(`Erro da API Bitmart: ${response.status} - ${errorText}`);
      }

      const proxyData = await response.json();
      
      if (!proxyData.contents) {
        throw new Error("Dados inválidos da API Bitmart - resposta vazia");
      }
      
      const data = JSON.parse(proxyData.contents);
      console.log("Bitmart API response:", data);

      if (!data.data) {
        throw new Error("Dados inválidos da API Bitmart");
      }

      return this.transformBitmartData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchBitmartOrderBook:", error);
      throw error;
    }
  }

  private async fetchBybitOrderBook(config: ApiConfig): Promise<OrderBook> {
    const url = `${this.baseUrls.bybit}/orderbook?category=spot&symbol=${config.symbol}&limit=200`;
    
    try {
      console.log("Fetching from Bybit URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Bybit API Error:", errorText);
        throw new Error(`Erro da API Bybit: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Bybit API response:", data);

      if (!data.result) {
        throw new Error("Dados inválidos da API Bybit");
      }

      return this.transformBybitData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchBybitOrderBook:", error);
      throw error;
    }
  }

  private async fetchCoinexOrderBook(config: ApiConfig): Promise<OrderBook> {
    // CoinEx uses different symbol formats and API structure - incluindo LUNA e TURBO
    const coinexSymbolMap: { [key: string]: string } = {
      'BTCUSDT': 'BTCUSDT',
      'BTCUSDC': 'BTCUSDC', 
      'SHIBUSDT': 'SHIBUSDT',
      'SHIBUSDC': 'SHIBUSDC',
      'LUNCUSDT': 'LUNCUSDT',
      'LUNCUSDC': 'LUNCUSDC',
      'LUNAUSDT': 'LUNAUSDT',
      'LUNAUSDC': 'LUNAUSDC',
      'XLMUSDT': 'XLMUSDT',
      'XLMUSDC': 'XLMUSDC',
      'XRPUSDT': 'XRPUSDT',
      'XRPUSDC': 'XRPUSDC',
      'PEPEUSDT': 'PEPEUSDT',
      'PEPEUSDC': 'PEPEUSDC',
      'WENUSDT': 'WENUSDT',
      'VINUUSDT': 'VINUUSDT',
      'BONKUSDT': 'BONKUSDT',
      'KISHUUSDT': 'KISHUUSDT',
      'VOLTINUUSDT': 'VOLTINUUSDT',
      'TURBOUSDT': 'TURBOUSDT',
      'TURBOUSDC': 'TURBOUSDC'
    };
    
    const coinexSymbol = coinexSymbolMap[config.symbol] || config.symbol;
    // Use v2 API which has better structure
    const originalUrl = `https://api.coinex.com/v2/spot/depth?market=${coinexSymbol}&limit=50&interval=0`;
    const url = `${this.baseUrls.coinex}${encodeURIComponent(originalUrl)}`;
    
    try {
      console.log("Fetching from CoinEx URL:", url);
      console.log("Mapped symbol for CoinEx:", coinexSymbol);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro da API CoinEx: ${response.status}`);
      }

      const proxyData = await response.json();
      
      if (!proxyData.contents) {
        throw new Error("Dados inválidos da API CoinEx - resposta vazia");
      }
      
      const data = JSON.parse(proxyData.contents);
      console.log("CoinEx API v2 response:", data);

      if (!data || data.code !== 0) {
        console.error("CoinEx API v2 error:", data);
        throw new Error(`Erro da API CoinEx v2: ${data?.message || 'Status não OK'}`);
      }

      if (!data.data || !data.data.depth) {
        console.error("CoinEx v2 missing depth data:", data);
        throw new Error("Dados inválidos da API CoinEx v2 - sem dados de profundidade");
      }

      // Check if asks and bids exist in the depth structure
      if (!data.data.depth.asks || !data.data.depth.bids) {
        console.error("CoinEx v2 order book structure:", data.data.depth);
        throw new Error("Dados inválidos da API CoinEx v2 - sem bids/asks na profundidade");
      }

      return this.transformCoinexV2Data(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchCoinexOrderBook:", error);
      if (error instanceof SyntaxError) {
        throw new Error("Erro ao processar dados da CoinEx - formato inválido");
      }
      throw error;
    }
  }

  private async fetchBingxOrderBook(config: ApiConfig): Promise<OrderBook> {
    const originalUrl = `https://open-api.bingx.com/openApi/spot/v1/market/depth?symbol=${config.symbol}&limit=200`;
    const url = `${this.baseUrls.bingx}${encodeURIComponent(originalUrl)}`;
    
    try {
      console.log("Fetching from BingX URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("BingX API Error:", errorText);
        throw new Error(`Erro da API BingX: ${response.status} - ${errorText}`);
      }

      const proxyData = await response.json();
      
      if (!proxyData.contents) {
        throw new Error("Dados inválidos da API BingX - resposta vazia");
      }
      
      const data = JSON.parse(proxyData.contents);
      console.log("BingX API response:", data);

      if (!data.data || !data.data.bids || !data.data.asks) {
        throw new Error("Dados inválidos da API BingX - estrutura incorreta");
      }

      return this.transformBingxData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchBingxOrderBook:", error);
      if (error instanceof SyntaxError) {
        throw new Error("Erro ao processar dados da BingX - formato inválido");
      }
      throw error;
    }
  }

  private async fetchCryptocomOrderBook(config: ApiConfig): Promise<OrderBook> {
    const originalUrl = `https://api.crypto.com/exchange/v1/public/get-book?instrument_name=${config.symbol}&depth=150`;
    const url = `${this.baseUrls.cryptocom}${encodeURIComponent(originalUrl)}`;
    
    try {
      console.log("Fetching from Crypto.com URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Crypto.com API Error:", errorText);
        throw new Error(`Erro da API Crypto.com: ${response.status} - ${errorText}`);
      }

      const proxyData = await response.json();
      
      if (!proxyData.contents) {
        throw new Error("Dados inválidos da API Crypto.com - resposta vazia");
      }
      
      const data = JSON.parse(proxyData.contents);
      console.log("Crypto.com API response:", data);

      if (!data.result || !data.result.data || !data.result.data[0] || 
          !data.result.data[0].bids || !data.result.data[0].asks) {
        throw new Error("Dados inválidos da API Crypto.com - estrutura incorreta");
      }

      return this.transformCryptocomData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchCryptocomOrderBook:", error);
      if (error instanceof SyntaxError) {
        throw new Error("Erro ao processar dados da Crypto.com - formato inválido");
      }
      throw error;
    }
  }

  private transformBinanceData(data: any, symbol: string): OrderBook {
    const transformEntries = (entries: string[][]): OrderBookEntry[] => {
      return entries.map(([price, quantity]) => ({
        price,
        quantity
      }));
    };

    return {
      symbol,
      bids: transformEntries(data.bids || []),
      asks: transformEntries(data.asks || []),
      lastUpdateId: data.lastUpdateId,
      timestamp: Date.now()
    };
  }

  private transformKucoinData(data: any, symbol: string): OrderBook {
    const orderBookData = data.data;

    const transformEntries = (entries: string[][]): OrderBookEntry[] => {
      return entries.map(([price, quantity]) => ({
        price,
        quantity
      }));
    };

    const transformedBids = transformEntries(orderBookData.bids || []);
    const transformedAsks = transformEntries(orderBookData.asks || []);

    console.log("KuCoin transformed - Bids:", transformedBids.length, "Asks:", transformedAsks.length);

    return {
      symbol,
      bids: transformedBids,
      asks: transformedAsks,
      timestamp: Date.now()
    };
  }

  private transformKcexData(data: any, symbol: string): OrderBook {
    const transformEntries = (entries: string[][]): OrderBookEntry[] => {
      return entries.map(([price, quantity]) => ({
        price,
        quantity
      }));
    };

    return {
      symbol,
      bids: transformEntries(data.bids || []),
      asks: transformEntries(data.asks || []),
      timestamp: Date.now()
    };
  }

  private transformKrakenData(data: any, symbol: string): OrderBook {
    const result = data.result;
    const pairKey = Object.keys(result)[0];
    const orderBookData = result[pairKey];

    const transformEntries = (entries: string[][]): OrderBookEntry[] => {
      return entries.map(([price, quantity]) => ({
        price,
        quantity
      }));
    };

    return {
      symbol,
      bids: transformEntries(orderBookData.bids || []),
      asks: transformEntries(orderBookData.asks || []),
      timestamp: Date.now()
    };
  }

  private transformCoinbaseData(data: any, symbol: string): OrderBook {
    const transformEntries = (entries: string[][]): OrderBookEntry[] => {
      return entries.map(([price, quantity]) => ({
        price,
        quantity
      }));
    };

    return {
      symbol,
      bids: transformEntries(data.bids || []),
      asks: transformEntries(data.asks || []),
      timestamp: Date.now()
    };
  }

  private transformBitfinexData(data: any, symbol: string): OrderBook {
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];

    // Verificar se data é um array antes de iterar
    if (!Array.isArray(data)) {
      console.error("Bitfinex data is not an array:", data);
      throw new Error("Dados inválidos da API Bitfinex - não é um array");
    }

    data.forEach((entry: any) => {
      // Verificar se entry é um array com pelo menos 3 elementos
      if (!Array.isArray(entry) || entry.length < 3) {
        console.warn("Skipping invalid Bitfinex entry:", entry);
        return;
      }
      
      const [price, count, amount] = entry;
      
      if (typeof price === 'number' && typeof amount === 'number' && count > 0) {
        if (amount > 0) {
          bids.push({
            price: price.toString(),
            quantity: amount.toString()
          });
        } else {
          asks.push({
            price: price.toString(),
            quantity: Math.abs(amount).toString()
          });
        }
      }
    });

    // Ordenar bids por preço decrescente e asks por preço crescente
    bids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    asks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    return {
      symbol,
      bids,
      asks,
      timestamp: Date.now()
    };
  }

  private transformBitgetData(data: any, symbol: string): OrderBook {
    const orderBookData = data.data;

    const transformEntries = (entries: string[][]): OrderBookEntry[] => {
      return entries.map(([price, quantity]) => ({
        price,
        quantity
      }));
    };

    return {
      symbol,
      bids: transformEntries(orderBookData.bids || []),
      asks: transformEntries(orderBookData.asks || []),
      timestamp: Date.now()
    };
  }

  private transformOkxData(data: any, symbol: string): OrderBook {
    const orderBookData = data.data[0];

    const transformEntries = (entries: string[][]): OrderBookEntry[] => {
      return entries.map(([price, quantity]) => ({
        price,
        quantity
      }));
    };

    return {
      symbol,
      bids: transformEntries(orderBookData.bids || []),
      asks: transformEntries(orderBookData.asks || []),
      timestamp: Date.now()
    };
  }

  private transformGateioData(data: any, symbol: string): OrderBook {
    const transformEntries = (entries: string[][]): OrderBookEntry[] => {
      return entries.map(([price, quantity]) => ({
        price,
        quantity
      }));
    };

    return {
      symbol,
      bids: transformEntries(data.bids || []),
      asks: transformEntries(data.asks || []),
      timestamp: Date.now()
    };
  }

  private transformBitmartData(data: any, symbol: string): OrderBook {
    const orderBookData = data.data;

    const transformEntries = (entries: any[]): OrderBookEntry[] => {
      if (!entries || !Array.isArray(entries)) return [];
      return entries.map((entry) => {
        // Bitmart pode retornar diferentes formatos
        if (entry.price && entry.amount) {
          return {
            price: entry.price.toString(),
            quantity: entry.amount.toString()
          };
        } else if (entry.price && entry.size) {
          return {
            price: entry.price.toString(),
            quantity: entry.size.toString()
          };
        } else if (Array.isArray(entry) && entry.length >= 2) {
          return {
            price: entry[0].toString(),
            quantity: entry[1].toString()
          };
        }
        return {
          price: "0",
          quantity: "0"
        };
      });
    };

    return {
      symbol,
      bids: transformEntries(orderBookData.buys || []),
      asks: transformEntries(orderBookData.sells || []),
      timestamp: Date.now()
    };
  }

  private transformBybitData(data: any, symbol: string): OrderBook {
    const orderBookData = data.result;

    const transformEntries = (entries: string[][]): OrderBookEntry[] => {
      return entries.map(([price, quantity]) => ({
        price,
        quantity
      }));
    };

    return {
      symbol,
      bids: transformEntries(orderBookData.b || []),
      asks: transformEntries(orderBookData.a || []),
      timestamp: Date.now()
    };
  }

  private transformCoinexV2Data(data: any, symbol: string): OrderBook {
    const orderBookData = data.data.depth; // Access the depth object

    const transformEntries = (entries: any[]): OrderBookEntry[] => {
      if (!Array.isArray(entries)) {
        console.error("CoinEx v2 entries is not an array:", entries);
        return [];
      }
      return entries.map((entry) => {
        // CoinEx API v2 returns arrays with [price, amount]
        if (Array.isArray(entry) && entry.length >= 2) {
          return {
            price: entry[0].toString(),
            quantity: entry[1].toString()
          };
        }
        console.warn("Invalid CoinEx v2 entry format:", entry);
        return {
          price: "0",
          quantity: "0"
        };
      });
    };

    return {
      symbol,
      bids: transformEntries(orderBookData.bids || []),
      asks: transformEntries(orderBookData.asks || []),
      timestamp: Date.now()
    };
  }

  private transformMexcData(data: any, symbol: string): OrderBook {
    const transformEntries = (entries: any[]): OrderBookEntry[] => {
      if (!Array.isArray(entries)) {
        console.error("MEXC entries is not an array:", entries);
        return [];
      }
      
      return entries
        .filter(entry => Array.isArray(entry) && entry.length >= 2)
        .map(([price, quantity]) => ({
          price: price.toString(),
          quantity: quantity.toString()
        }));
    };

    const transformedBids = transformEntries(data.bids || []);
    const transformedAsks = transformEntries(data.asks || []);

    return {
      symbol,
      bids: transformedBids,
      asks: transformedAsks,
      timestamp: Date.now()
    };
  }

  private transformCoinexData(data: any, symbol: string): OrderBook {
    const orderBookData = data.data;

    const transformEntries = (entries: any[]): OrderBookEntry[] => {
      if (!Array.isArray(entries)) {
        console.error("CoinEx entries is not an array:", entries);
        return [];
      }
      return entries.map((entry) => {
        // CoinEx API v1 retorna arrays com [price, quantity]
        if (Array.isArray(entry) && entry.length >= 2) {
          return {
            price: entry[0].toString(),
            quantity: entry[1].toString()
          };
        }
        console.warn("Invalid CoinEx entry format:", entry);
        return {
          price: "0",
          quantity: "0"
        };
      });
    };

    return {
      symbol,
      bids: transformEntries(orderBookData.bids || []),
      asks: transformEntries(orderBookData.asks || []),
      timestamp: Date.now()
    };
  }

  private transformBingxData(data: any, symbol: string): OrderBook {
    const orderBookData = data.data;

    const transformEntries = (entries: string[][]): OrderBookEntry[] => {
      return entries.map(([price, quantity]) => ({
        price,
        quantity
      }));
    };

    return {
      symbol,
      bids: transformEntries(orderBookData.bids || []),
      asks: transformEntries(orderBookData.asks || []),
      timestamp: Date.now()
    };
  }

  private transformCryptocomData(data: any, symbol: string): OrderBook {
    const orderBookData = data.result.data[0];

    const transformEntries = (entries: any[]): OrderBookEntry[] => {
      if (!Array.isArray(entries)) return [];
      return entries.map((entry) => ({
        price: entry[0].toString(),
        quantity: entry[1].toString()
      }));
    };

    return {
      symbol,
      bids: transformEntries(orderBookData.bids || []),
      asks: transformEntries(orderBookData.asks || []),
      timestamp: Date.now()
    };
  }

  private async fetchNovadaxOrderBook(config: ApiConfig): Promise<OrderBook> {
    const originalUrl = `https://api.novadax.com/v1/market/depth?symbol=${config.symbol}&limit=100`;
    const url = `${this.baseUrls.novadax}${encodeURIComponent(originalUrl)}`;
    
    try {
      console.log("Fetching from NovaDAX URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("NovaDAX API Error:", errorText);
        throw new Error(`Erro da API NovaDAX: ${response.status} - ${errorText}`);
      }

      const proxyData = await response.json();
      
      if (!proxyData.contents) {
        throw new Error("Dados inválidos da API NovaDAX - resposta vazia");
      }
      
      const data = JSON.parse(proxyData.contents);
      console.log("NovaDAX API response:", data);

      if (data.code !== "A10000") {
        throw new Error(`Erro NovaDAX: ${data.message || data.code}`);
      }

      if (!data.data || !data.data.bids || !data.data.asks) {
        throw new Error("Dados inválidos da API NovaDAX - estrutura incorreta");
      }

      return this.transformNovadaxData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchNovadaxOrderBook:", error);
      if (error instanceof SyntaxError) {
        throw new Error("Erro ao processar dados da NovaDAX - formato inválido");
      }
      throw error;
    }
  }

  private transformNovadaxData(data: any, symbol: string): OrderBook {
    const orderBookData = data.data;

    const transformEntries = (entries: any[]): OrderBookEntry[] => {
      if (!Array.isArray(entries)) {
        console.error("NovaDAX entries is not an array:", entries);
        return [];
      }
      return entries.map((entry) => ({
        price: entry[0].toString(),
        quantity: entry[1].toString()
      }));
    };

    return {
      symbol,
      bids: transformEntries(orderBookData.bids || []),
      asks: transformEntries(orderBookData.asks || []),
      timestamp: Date.now()
    };
  }

  private async fetchXtOrderBook(config: ApiConfig): Promise<OrderBook> {
    // XT uses lowercase symbols with underscore: shib_usdt
    const symbol = config.symbol.toLowerCase().replace(/([a-z]+)(usdt|usdc)$/, '$1_$2');
    const originalUrl = `https://sapi.xt.com/v4/public/depth?symbol=${symbol}&limit=200`;
    const url = `${this.baseUrls.xt}${encodeURIComponent(originalUrl)}`;
    
    try {
      console.log("Fetching from XT URL:", url);
      console.log("Mapped symbol for XT:", symbol);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("XT API Error:", errorText);
        throw new Error(`Erro da API XT: ${response.status} - ${errorText}`);
      }

      const proxyData = await response.json();
      
      if (!proxyData.contents) {
        throw new Error("Dados inválidos da API XT - resposta vazia");
      }
      
      const data = JSON.parse(proxyData.contents);
      console.log("XT API response:", data);

      if (data.rc !== 0) {
        throw new Error(`Erro XT: ${data.mc || data.rc}`);
      }

      if (!data.result || !data.result.bids || !data.result.asks) {
        throw new Error("Dados inválidos da API XT - estrutura incorreta");
      }

      return this.transformXtData(data, config.symbol);
    } catch (error) {
      console.error("Error in fetchXtOrderBook:", error);
      if (error instanceof SyntaxError) {
        throw new Error("Erro ao processar dados da XT - formato inválido");
      }
      throw error;
    }
  }

  private transformXtData(data: any, symbol: string): OrderBook {
    const orderBookData = data.result;

    const transformEntries = (entries: any[]): OrderBookEntry[] => {
      if (!Array.isArray(entries)) {
        console.error("XT entries is not an array:", entries);
        return [];
      }
      return entries.map((entry) => ({
        price: entry[0].toString(),
        quantity: entry[1].toString()
      }));
    };

    return {
      symbol,
      bids: transformEntries(orderBookData.bids || []),
      asks: transformEntries(orderBookData.asks || []),
      timestamp: Date.now()
    };
  }

  private async fetchBtccOrderBook(config: ApiConfig): Promise<OrderBook> {
    // BTCC usa formato similar a Binance
    const symbol = config.symbol.toUpperCase();
    
    // Tentar múltiplos proxies
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(`https://api.btcc.com/api/v1/depth?symbol=${symbol}&limit=200`)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://api.btcc.com/api/v1/depth?symbol=${symbol}&limit=200`)}`,
      `${this.baseUrls.btcc}${encodeURIComponent(`https://api.btcc.com/api/v1/depth?symbol=${symbol}&limit=200`)}`
    ];
    
    let lastError: Error | null = null;
    
    for (const url of proxies) {
      try {
        console.log("Fetching from BTCC URL:", url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const responseData = await response.json();
        
        let data = responseData;
        if (responseData.contents) {
          if (typeof responseData.contents === 'string') {
            if (responseData.contents.toLowerCase().includes('<html') || responseData.contents.includes('403')) {
              throw new Error("Proxy blocked");
            }
            data = JSON.parse(responseData.contents);
          } else {
            data = responseData.contents;
          }
        }
        
        console.log("BTCC API response:", data);

        // Verificar diferentes formatos de resposta
        if (data.bids && data.asks) {
          return this.transformBtccData(data, config.symbol);
        } else if (data.data && data.data.bids && data.data.asks) {
          return this.transformBtccData(data.data, config.symbol);
        }
        
        throw new Error("Invalid data structure");
      } catch (error) {
        console.error(`BTCC proxy failed (${url}):`, error);
        lastError = error as Error;
        continue;
      }
    }
    
    throw new Error(`Erro BTCC: ${lastError?.message || 'Não foi possível conectar'}`);
  }

  private transformBtccData(data: any, symbol: string): OrderBook {
    const transformEntries = (entries: any[]): OrderBookEntry[] => {
      if (!Array.isArray(entries)) {
        console.error("BTCC entries is not an array:", entries);
        return [];
      }
      return entries.map((entry) => {
        if (Array.isArray(entry) && entry.length >= 2) {
          return {
            price: entry[0].toString(),
            quantity: entry[1].toString()
          };
        } else if (entry.price !== undefined && (entry.amount !== undefined || entry.quantity !== undefined)) {
          return {
            price: entry.price.toString(),
            quantity: (entry.amount || entry.quantity).toString()
          };
        }
        return {
          price: "0",
          quantity: "0"
        };
      });
    };

    return {
      symbol,
      bids: transformEntries(data.bids || []),
      asks: transformEntries(data.asks || []),
      timestamp: Date.now()
    };
  }

  private async fetchDeepcoinOrderBook(config: ApiConfig): Promise<OrderBook> {
    // Deepcoin usa formato underscore: SHIB_USDT
    const symbol = config.symbol.includes('_') 
      ? config.symbol 
      : config.symbol.replace(/([A-Z]+)(USDT|USDC)$/, '$1_$2');
    
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(`https://api.deepcoin.com/deepcoin/market/orderbook?symbol=${symbol}&limit=200`)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://api.deepcoin.com/deepcoin/market/orderbook?symbol=${symbol}&limit=200`)}`,
      `${this.baseUrls.deepcoin}${encodeURIComponent(`https://api.deepcoin.com/deepcoin/market/orderbook?symbol=${symbol}&limit=200`)}`
    ];
    
    let lastError: Error | null = null;
    
    for (const url of proxies) {
      try {
        console.log("Fetching from Deepcoin URL:", url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const responseData = await response.json();
        
        let data = responseData;
        if (responseData.contents) {
          if (typeof responseData.contents === 'string') {
            if (responseData.contents.toLowerCase().includes('<html') || responseData.contents.includes('403')) {
              throw new Error("Proxy blocked");
            }
            data = JSON.parse(responseData.contents);
          } else {
            data = responseData.contents;
          }
        }
        
        console.log("Deepcoin API response:", data);

        // Verificar diferentes formatos de resposta
        if (data.bids && data.asks) {
          return this.transformDeepcoinData(data, config.symbol);
        } else if (data.data && data.data.bids && data.data.asks) {
          return this.transformDeepcoinData(data.data, config.symbol);
        } else if (data.result && data.result.bids && data.result.asks) {
          return this.transformDeepcoinData(data.result, config.symbol);
        }
        
        throw new Error("Invalid data structure");
      } catch (error) {
        console.error(`Deepcoin proxy failed (${url}):`, error);
        lastError = error as Error;
        continue;
      }
    }
    
    throw new Error(`Erro Deepcoin: ${lastError?.message || 'Não foi possível conectar'}`);
  }

  private transformDeepcoinData(data: any, symbol: string): OrderBook {
    const transformEntries = (entries: any[]): OrderBookEntry[] => {
      if (!Array.isArray(entries)) {
        console.error("Deepcoin entries is not an array:", entries);
        return [];
      }
      return entries.map((entry) => {
        if (Array.isArray(entry) && entry.length >= 2) {
          return {
            price: entry[0].toString(),
            quantity: entry[1].toString()
          };
        } else if (entry.price !== undefined && (entry.amount !== undefined || entry.quantity !== undefined || entry.size !== undefined)) {
          return {
            price: entry.price.toString(),
            quantity: (entry.amount || entry.quantity || entry.size).toString()
          };
        }
        return {
          price: "0",
          quantity: "0"
        };
      });
    };

    return {
      symbol,
      bids: transformEntries(data.bids || []),
      asks: transformEntries(data.asks || []),
      timestamp: Date.now()
    };
  }
}

export const orderBookService = new OrderBookService();
