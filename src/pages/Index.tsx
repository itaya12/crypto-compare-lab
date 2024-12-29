import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Coin, fetchTopCoins, fetchCoinHistory } from "@/services/api";
import { CoinSelector } from "@/components/CoinSelector";
import { ComparisonChart } from "@/components/ComparisonChart";
import { CoinStats } from "@/components/CoinStats";
import { Share2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedCoins, setSelectedCoins] = useState<(Coin | null)[]>([null, null]);
  const [showComparison, setShowComparison] = useState(false);

  const { data: coins = [] } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchTopCoins,
  });

  // Create an array of query keys for all possible selected coins
  const queryKeys = selectedCoins.map((coin) => 
    coin ? ["coinHistory", coin.id] : null
  );

  // Create individual queries for each coin
  const queries = queryKeys.map((key) => 
    useQuery({
      queryKey: key,
      queryFn: () => fetchCoinHistory(key?.[1] || ""),
      enabled: !!key,
    })
  );

  // Extract the history data from queries
  const coinsHistory = queries.map(query => query.data || []);

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
    setSelectedCoins([...selectedCoins, null]);
  };

  const removeCoin = (index: number) => {
    if (selectedCoins.length <= 2) {
      toast.error("Minimum two coins required for comparison");
      return;
    }
    const newCoins = [...selectedCoins];
    newCoins.splice(index, 1);
    setSelectedCoins(newCoins);
  };

  const updateCoin = (index: number, coin: Coin) => {
    const newCoins = [...selectedCoins];
    newCoins[index] = coin;
    setSelectedCoins(newCoins);
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
    "candlestick",
    "bar",
    "pie",
    "area",
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {selectedCoins.map((selectedCoin, index) => (
            <div key={index} className="relative">
              <CoinSelector
                coins={coins}
                selectedCoin={selectedCoin}
                onSelect={(coin) => updateCoin(index, coin)}
                label={`Select Coin ${index + 1}`}
              />
              {index >= 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2"
                  onClick={() => removeCoin(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            className="h-full min-h-[100px] flex items-center justify-center gap-2"
            onClick={addCoin}
          >
            <Plus className="h-4 w-4" />
            Add Coin
          </Button>
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
            <div className="space-y-24">
              {chartTypes.map((chartType) => (
                <div key={chartType} className="scroll-mt-8" id={chartType}>
                  <h2 className="text-2xl font-bold mb-6 capitalize">{chartType} Chart</h2>
                  <ComparisonChart
                    coinsData={coinsHistory}
                    coinSymbols={selectedCoins.map(coin => coin?.symbol || "")}
                    defaultChartType={chartType}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;