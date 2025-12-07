import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXCHANGES } from "@/data/exchanges";

interface ExchangeSelectorProps {
  currentExchange: string;
  onExchangeChange: (newExchange: string) => void;
}

const ExchangeSelector = ({ currentExchange, onExchangeChange }: ExchangeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">Corretora</label>
      <Select value={currentExchange} onValueChange={onExchangeChange}>
        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
          <SelectValue placeholder="Selecione uma corretora" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600 max-h-80">
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
