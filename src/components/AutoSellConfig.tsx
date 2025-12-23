import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ApiConfig } from "@/types/orderbook";
import { AutoSellSettings } from "@/types/trading";
import { toast } from "@/hooks/use-toast";

interface AutoSellConfigProps {
  apiConfig: ApiConfig | null;
}

const AutoSellConfig = ({ apiConfig }: AutoSellConfigProps) => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AutoSellSettings>({
    enabled: false,
    exchange: apiConfig?.exchange || "",
    symbol: apiConfig?.symbol || "",
    type: "MARKET",
    targetPrice: "",
    quantityPercent: 100,
    fixedQuantity: ""
  });

  useEffect(() => {
    if (!apiConfig) return;
    const key = `autoSellConfig:${apiConfig.exchange}:${apiConfig.symbol}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed: AutoSellSettings = JSON.parse(stored);
        setSettings(parsed);
      } else {
        setSettings(s => ({
          ...s,
          exchange: apiConfig.exchange,
          symbol: apiConfig.symbol
        }));
      }
    } catch {
    }
  }, [apiConfig]);

  const handleSave = () => {
    if (!apiConfig) {
      toast({
        title: "Erro",
        description: "Configure a corretora e o par antes de salvar.",
        variant: "destructive"
      });
      return;
    }
    const key = `autoSellConfig:${apiConfig.exchange}:${apiConfig.symbol}`;
    try {
      const payload: AutoSellSettings = {
        enabled: settings.enabled,
        exchange: apiConfig.exchange,
        symbol: apiConfig.symbol,
        type: settings.type,
        targetPrice: settings.targetPrice,
        quantityPercent: settings.quantityPercent,
        fixedQuantity: settings.fixedQuantity
      };
      localStorage.setItem(key, JSON.stringify(payload));
      toast({
        title: "Sucesso",
        description: "Configurações de Auto Sell salvas.",
      });
      setOpen(false);
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: "Falha ao salvar configurações de Auto Sell.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700">
          Configuração Auto Sell
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Auto Sell</DialogTitle>
          <DialogDescription>
            Configure regras de venda automática para o par selecionado.
          </DialogDescription>
        </DialogHeader>
        <Card className="p-4 space-y-4 bg-slate-800 border-slate-700">
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
            <Label htmlFor="enabled" className="text-white">Ativar Auto Sell</Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-white">Tipo de Ordem</Label>
              <Select 
                value={settings.type} 
                onValueChange={(value: "LIMIT" | "MARKET") => setSettings({ ...settings, type: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="MARKET" className="text-white hover:bg-slate-600">MARKET</SelectItem>
                  <SelectItem value="LIMIT" className="text-white hover:bg-slate-600">LIMIT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetPrice" className="text-white">Preço Alvo</Label>
              <Input
                id="targetPrice"
                type="number"
                step="0.00000001"
                placeholder="0.00000000"
                value={settings.targetPrice || ""}
                onChange={(e) => setSettings({ ...settings, targetPrice: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantityPercent" className="text-white">% do saldo</Label>
              <Input
                id="quantityPercent"
                type="number"
                step="1"
                placeholder="100"
                value={settings.quantityPercent?.toString() || ""}
                onChange={(e) => setSettings({ ...settings, quantityPercent: parseFloat(e.target.value) })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fixedQuantity" className="text-white">Quantidade fixa</Label>
              <Input
                id="fixedQuantity"
                type="number"
                step="0.000001"
                placeholder="0.000000"
                value={settings.fixedQuantity || ""}
                onChange={(e) => setSettings({ ...settings, fixedQuantity: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 font-mono"
              />
            </div>
          </div>
        </Card>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700">
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoSellConfig;
