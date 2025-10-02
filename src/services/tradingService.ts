
import { ApiConfig } from "@/types/orderbook";
import { CreateOrderRequest, OrderResponse, Balance } from "@/types/trading";

// Função para criar assinatura HMAC-SHA256
async function createSignature(queryString: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(queryString));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

class TradingService {
  async createOrder(config: ApiConfig, orderRequest: CreateOrderRequest): Promise<OrderResponse> {
    console.log("Creating order:", orderRequest);

    switch (config.exchange) {
      case "binance-auth":
        return this.createBinanceOrder(config, orderRequest);
      default:
        throw new Error(`Trading não suportado para ${config.exchange}`);
    }
  }

  async getBalance(config: ApiConfig): Promise<Balance[]> {
    console.log("Getting balance for:", config.exchange);

    switch (config.exchange) {
      case "binance-auth":
        return this.getBinanceBalance(config);
      default:
        throw new Error(`Consulta de saldo não suportada para ${config.exchange}`);
    }
  }

  private async createBinanceOrder(config: ApiConfig, orderRequest: CreateOrderRequest): Promise<OrderResponse> {
    if (!config.apiKey || !config.apiSecret) {
      throw new Error("API Key e Secret são obrigatórios");
    }

    const baseUrl = config.testnet 
      ? "https://testnet.binance.vision/api/v3" 
      : "https://api.binance.com/api/v3";
    
    const timestamp = Date.now();
    const params = new URLSearchParams({
      symbol: orderRequest.symbol,
      side: orderRequest.side,
      type: orderRequest.type,
      quantity: orderRequest.quantity,
      timestamp: timestamp.toString()
    });

    if (orderRequest.price && orderRequest.type === 'LIMIT') {
      params.append('price', orderRequest.price);
    }

    if (orderRequest.timeInForce && orderRequest.type === 'LIMIT') {
      params.append('timeInForce', orderRequest.timeInForce);
    }

    const queryString = params.toString();
    const signature = await createSignature(queryString, config.apiSecret);
    const signedQuery = `${queryString}&signature=${signature}`;
    
    try {
      console.log("Sending order to:", `${baseUrl}/order/test`);
      console.log("Order params:", signedQuery);
      
      const response = await fetch(`${baseUrl}/order/test`, {
        method: 'POST',
        headers: {
          'X-MBX-APIKEY': config.apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: signedQuery
      });

      console.log("Order response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Binance Order API Error:", errorText);
        throw new Error(`Erro ao criar ordem: ${response.status} - ${errorText}`);
      }

      const responseData = await response.text();
      console.log("Order response:", responseData);

      return {
        orderId: `test_${Date.now()}`,
        symbol: orderRequest.symbol,
        side: orderRequest.side,
        type: orderRequest.type,
        quantity: orderRequest.quantity,
        price: orderRequest.price || '0',
        status: 'NEW',
        transactTime: timestamp
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  private async getBinanceBalance(config: ApiConfig): Promise<Balance[]> {
    if (!config.apiKey || !config.apiSecret) {
      throw new Error("API Key e Secret são obrigatórios");
    }

    const baseUrl = config.testnet 
      ? "https://testnet.binance.vision/api/v3" 
      : "https://api.binance.com/api/v3";
    
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = await createSignature(queryString, config.apiSecret);
    
    try {
      console.log("Fetching balance from:", `${baseUrl}/account`);
      
      const response = await fetch(`${baseUrl}/account?${queryString}&signature=${signature}`, {
        method: 'GET',
        headers: {
          'X-MBX-APIKEY': config.apiKey,
        }
      });

      console.log("Balance response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Binance Balance API Error:", errorText);
        
        if (response.status === 401) {
          throw new Error("Chaves API inválidas ou sem permissão");
        }
        
        throw new Error(`Erro ao consultar saldo: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Balance data received:", data.balances?.length || 0, "assets");
      
      return data.balances || [];
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }
}

export const tradingService = new TradingService();
