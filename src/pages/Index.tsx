
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/LoginForm";
import ApiConfiguration from "@/components/ApiConfiguration";
import OrderBookDisplay from "@/components/OrderBookDisplay";
import { ApiConfig } from "@/types/orderbook";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [apiConfig, setApiConfig] = useState<ApiConfig | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  const handleApiConfigSave = (config: ApiConfig) => {
    setApiConfig(config);
    setIsConfigured(true);
    console.log("API Configuration saved:", config);
  };

  const handleSymbolChange = (newSymbol: string) => {
    if (apiConfig) {
      const updatedConfig = { ...apiConfig, symbol: newSymbol };
      setApiConfig(updatedConfig);
      console.log("Symbol changed to:", newSymbol);
    }
  };

  const handleExchangeChange = (newExchange: string) => {
    if (apiConfig) {
      // Reset to first available symbol when changing exchange
      const updatedConfig = { ...apiConfig, exchange: newExchange, symbol: "" };
      setApiConfig(updatedConfig);
      console.log("Exchange changed to:", newExchange);
    }
  };

  const handleReconfigure = () => {
    setIsConfigured(false);
    setApiConfig(null);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsConfigured(false);
    setApiConfig(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">OB</span>
              </div>
              <h1 className="text-4xl font-bold text-white">
                Crypto Order Book
              </h1>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
            >
              Sair
            </Button>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Visualize order books completos de corretoras de crypto em tempo real com dados precisos e interface profissional
          </p>
        </header>

        {!isConfigured ? (
          <div className="max-w-2xl mx-auto">
            <ApiConfiguration onSave={handleApiConfigSave} />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">
                  Conectado: {apiConfig?.exchange} - {apiConfig?.symbol}
                </span>
              </div>
              <button
                onClick={handleReconfigure}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
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
