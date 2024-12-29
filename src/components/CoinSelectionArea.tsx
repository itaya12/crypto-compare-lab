import { Coin } from "@/services/api";
import { CoinSelector } from "./CoinSelector";
import { Button } from "./ui/button";
import { Minus } from "lucide-react";

interface CoinSelectionAreaProps {
  selectedCoins: (Coin | null)[];
  additionalCoins: (Coin | null)[];
  coins: Coin[];
  onUpdateCoin: (index: number, coin: Coin, isAdditional: boolean) => void;
  onRemoveCoin: (index: number) => void;
  onAddCoin: () => void;
  onCompareAll: () => void;
}

export const CoinSelectionArea = ({
  selectedCoins,
  additionalCoins,
  coins,
  onUpdateCoin,
  onRemoveCoin,
  onAddCoin,
  onCompareAll,
}: CoinSelectionAreaProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
      {selectedCoins.map((selectedCoin, index) => (
        <div key={index} className="relative">
          <CoinSelector
            coins={coins}
            selectedCoin={selectedCoin}
            onSelect={(coin) => onUpdateCoin(index, coin, false)}
            label={`Select Coin ${index + 1}`}
          />
        </div>
      ))}
      {additionalCoins.map((coin, index) => (
        <div key={`additional-${index}`} className="relative">
          <CoinSelector
            coins={coins}
            selectedCoin={coin}
            onSelect={(coin) => onUpdateCoin(index, coin, true)}
            label={`Select Additional Coin ${index + 3}`}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2"
            onClick={() => onRemoveCoin(index)}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="h-full min-h-[100px] flex-1 flex items-center justify-center gap-2"
          onClick={onAddCoin}
        >
          Add Coin
        </Button>
      </div>
      <div className="flex gap-4">
        <Button
          className="h-full min-h-[100px] flex-1 flex items-center justify-center gap-2"
          onClick={onCompareAll}
        >
          Compare All
        </Button>
      </div>
    </div>
  );
};