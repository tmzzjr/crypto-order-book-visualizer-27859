import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ApiConfig } from "@/types/orderbook";
import { getSymbolsForExchange } from "@/data/exchanges";

interface SymbolSelectorProps {
  apiConfig: ApiConfig;
  onSymbolChange: (newSymbol: string) => void;
}

const SymbolSelector = ({ apiConfig, onSymbolChange }: SymbolSelectorProps) => {
  const [selectedSymbol, setSelectedSymbol] = useState(apiConfig.symbol);
  
  const availableSymbols = getSymbolsForExchange(apiConfig.exchange);

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
        <SelectContent className="bg-slate-700 border-slate-600 max-h-80">
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
