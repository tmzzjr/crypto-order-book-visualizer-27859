
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/LoginForm";
import ApiConfiguration from "@/components/ApiConfiguration";
import OrderBookDisplay from "@/components/OrderBookDisplay";
import { ApiConfig } from "@/types/orderbook";

const Index = () => {
  const { user, signOut } = useAuth();
  const [apiConfig, setApiConfig] = useState<ApiConfig | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("orderBookApiConfig");
      if (stored) {
        const parsed: ApiConfig = JSON.parse(stored);
        setApiConfig(parsed);
        setIsConfigured(!!parsed.exchange && !!parsed.symbol);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleApiConfigSave = (config: ApiConfig) => {
    setApiConfig(config);
    setIsConfigured(true);
    try {
      localStorage.setItem("orderBookApiConfig", JSON.stringify(config));
    } catch {
      // ignore storage errors
    }
  };

  const handleSymbolChange = (newSymbol: string) => {
    if (apiConfig) {
      const updatedConfig = { ...apiConfig, symbol: newSymbol };
      setApiConfig(updatedConfig);
      try {
        localStorage.setItem("orderBookApiConfig", JSON.stringify(updatedConfig));
      } catch {
        // ignore
      }
    }
  };

  const handleExchangeChange = (newExchange: string) => {
    if (apiConfig) {
      // Reset to first available symbol when changing exchange
      const updatedConfig = { ...apiConfig, exchange: newExchange, symbol: "" };
      setApiConfig(updatedConfig);
      try {
        localStorage.setItem("orderBookApiConfig", JSON.stringify(updatedConfig));
      } catch {
        // ignore
      }
    }
  };

  const handleReconfigure = () => {
    setIsConfigured(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsConfigured(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">OB</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Crypto Order Book
              </h1>
            </div>
            {user && (
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="bg-card hover:bg-muted text-foreground border-border"
              >
                Sair
              </Button>
            )}
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Visualize order books completos de corretoras de crypto em tempo real com dados precisos e interface profissional
          </p>
        </header>

        {!isConfigured ? (
          <div className="max-w-2xl mx-auto">
            <ApiConfiguration onSave={handleApiConfigSave} initialConfig={apiConfig ?? undefined} />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-foreground font-medium">
                  Conectado: {apiConfig?.exchange} - {apiConfig?.symbol}
                </span>
              </div>
              <button
                onClick={handleReconfigure}
                className="px-4 py-2 bg-card hover:bg-muted text-foreground rounded-lg transition-colors border border-border"
              >
                Reconfigurar
              </button>
            </div>
            <OrderBookDisplay 
              apiConfig={apiConfig} 
              onSymbolChange={handleSymbolChange}
              onExchangeChange={handleExchangeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
