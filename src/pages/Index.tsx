import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Coin, fetchTopCoins, fetchCoinHistory } from "@/services/api";
import { CoinSelector } from "@/components/CoinSelector";
import { CoinStats } from "@/components/CoinStats";
import { GeneralTableDescription } from "@/components/GeneralTableDescription";
import { ChartSection } from "@/components/ChartSection";
import { Share2, Plus, X, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const Index = () => {
  const [selectedCoins, setSelectedCoins] = useState<(Coin | null)[]>([null, null]);
  const [showComparison, setShowComparison] = useState(false);
  const [additionalCoins, setAdditionalCoins] = useState<(Coin | null)[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { data: coins = [] } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchTopCoins,
  });

  // Create fixed queries for maximum possible coins (e.g., 5)
  const queries = [0, 1, 2, 3, 4].map(index => {
    const coinId = selectedCoins[index]?.id;
    return useQuery({
      queryKey: ["coinHistory", coinId, startDate, endDate],
      queryFn: () => fetchCoinHistory(coinId || "", startDate.getTime(), endDate.getTime()),
      enabled: !!coinId,
    });
  });

  // Extract history data only for selected coins
  const coinsHistory = selectedCoins.map((_, index) => queries[index].data || []);

  useEffect(() => {
    if (coins.length > 0) {
      const bitcoin = coins.find((coin) => coin.symbol === "BTC");
      const ethereum = coins.find((coin) => coin.symbol === "ETH");
      
      if (bitcoin && ethereum) {
        setSelectedCoins([bitcoin, ethereum]);
      }
    }
  }, [coins]);

  const handleShare = () => {
    if (selectedCoins.every(coin => coin)) {
      const url = `${window.location.origin}?coins=${selectedCoins.map(coin => coin?.id).join(",")}`;
      navigator.clipboard.writeText(url);
      toast.success("Comparison link copied to clipboard!");
    }
  };

  const addCoin = () => {
    setAdditionalCoins([...additionalCoins, null]);
  };

  const removeCoin = (index: number) => {
    const newAdditionalCoins = [...additionalCoins];
    newAdditionalCoins.splice(index, 1);
    setAdditionalCoins(newAdditionalCoins);
  };

  const updateCoin = (index: number, coin: Coin, isAdditional: boolean = false) => {
    if (isAdditional) {
      const newAdditionalCoins = [...additionalCoins];
      newAdditionalCoins[index] = coin;
      setAdditionalCoins(newAdditionalCoins);
    } else {
      const newSelectedCoins = [...selectedCoins];
      newSelectedCoins[index] = coin;
      setSelectedCoins(newSelectedCoins);
    }
  };

  const handleCompare = () => {
    const allCoins = [...selectedCoins, ...additionalCoins].filter(coin => coin !== null) as Coin[];
    setSelectedCoins(allCoins);
    setAdditionalCoins([]);
    setShowComparison(true);
  };

  useEffect(() => {
    if (selectedCoins.length >= 2 && selectedCoins.every(coin => coin)) {
      setShowComparison(true);
    } else {
      setShowComparison(false);
    }
  }, [selectedCoins]);

  const chartTypes = [
    "line",
    "pie",
    "radar"
  ] as const;

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl font-bold">Crypto Comparison</h1>
        <p className="text-gray-400">
          Compare performance and statistics of different cryptocurrencies
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start: {format(startDate, "PP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                disabled={(date) =>
                  date > new Date() || date > endDate
                }
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End: {format(endDate, "PP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                disabled={(date) =>
                  date > new Date() || date < startDate
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {selectedCoins.map((selectedCoin, index) => (
            <div key={index} className="relative">
              <CoinSelector
                coins={coins}
                selectedCoin={selectedCoin}
                onSelect={(coin) => updateCoin(index, coin)}
                label={`Select Coin ${index + 1}`}
              />
            </div>
          ))}
          {additionalCoins.map((coin, index) => (
            <div key={`additional-${index}`} className="relative">
              <CoinSelector
                coins={coins}
                selectedCoin={coin}
                onSelect={(coin) => updateCoin(index, coin, true)}
                label={`Select Additional Coin ${index + 3}`}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2"
                onClick={() => removeCoin(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="h-full min-h-[100px] flex-1 flex items-center justify-center gap-2"
              onClick={addCoin}
            >
              <Plus className="h-4 w-4" />
              Add Coin
            </Button>
            {additionalCoins.length > 0 && (
              <Button
                className="h-full min-h-[100px] flex-1 flex items-center justify-center gap-2"
                onClick={handleCompare}
              >
                Compare All
              </Button>
            )}
          </div>
        </div>
      </div>

      {showComparison && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleShare}
              className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Comparison
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCoins.map((coin, index) => (
              coin && <CoinStats key={index} coin={coin} />
            ))}
          </div>

          {selectedCoins.every(coin => coin) && (
            <div className="space-y-8">
              <GeneralTableDescription coins={selectedCoins.filter((coin): coin is Coin => coin !== null)} />
              <ChartSection
                coinsHistory={coinsHistory}
                coinSymbols={selectedCoins.map(coin => coin?.symbol || "")}
                chartTypes={chartTypes}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
