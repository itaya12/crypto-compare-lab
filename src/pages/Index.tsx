import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Coin, fetchTopCoins, fetchCoinHistory } from "@/services/api";
import { CoinSelector } from "@/components/CoinSelector";
import { ComparisonChart } from "@/components/ComparisonChart";
import { CoinStats } from "@/components/CoinStats";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [selectedCoin1, setSelectedCoin1] = useState<Coin | null>(null);
  const [selectedCoin2, setSelectedCoin2] = useState<Coin | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const { data: coins = [] } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchTopCoins,
  });

  useEffect(() => {
    if (coins.length > 0) {
      const bitcoin = coins.find((coin) => coin.symbol === "BTC");
      const ethereum = coins.find((coin) => coin.symbol === "ETH");
      
      if (bitcoin && ethereum) {
        setSelectedCoin1(bitcoin);
        setSelectedCoin2(ethereum);
      }
    }
  }, [coins]);

  const { data: coin1History = [] } = useQuery({
    queryKey: ["coinHistory", selectedCoin1?.id],
    queryFn: () => fetchCoinHistory(selectedCoin1?.id || ""),
    enabled: !!selectedCoin1,
  });

  const { data: coin2History = [] } = useQuery({
    queryKey: ["coinHistory", selectedCoin2?.id],
    queryFn: () => fetchCoinHistory(selectedCoin2?.id || ""),
    enabled: !!selectedCoin2,
  });

  const handleShare = () => {
    if (selectedCoin1 && selectedCoin2) {
      const url = `${window.location.origin}?coin1=${selectedCoin1.id}&coin2=${selectedCoin2.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Comparison link copied to clipboard!");
    }
  };

  useEffect(() => {
    if (selectedCoin1 && selectedCoin2) {
      setShowComparison(true);
    } else {
      setShowComparison(false);
    }
  }, [selectedCoin1, selectedCoin2]);

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

      <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
        <CoinSelector
          coins={coins}
          selectedCoin={selectedCoin1}
          onSelect={setSelectedCoin1}
          label="Select First Coin"
        />
        <CoinSelector
          coins={coins}
          selectedCoin={selectedCoin2}
          onSelect={setSelectedCoin2}
          label="Select Second Coin"
        />
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

          <div className="grid md:grid-cols-2 gap-6">
            {selectedCoin1 && <CoinStats coin={selectedCoin1} />}
            {selectedCoin2 && <CoinStats coin={selectedCoin2} />}
          </div>

          {selectedCoin1 && selectedCoin2 && (
            <div className="space-y-24">
              {chartTypes.map((chartType) => (
                <div key={chartType} className="scroll-mt-8" id={chartType}>
                  <h2 className="text-2xl font-bold mb-6 capitalize">{chartType} Chart</h2>
                  <ComparisonChart
                    coin1Data={coin1History}
                    coin2Data={coin2History}
                    coin1Symbol={selectedCoin1.symbol}
                    coin2Symbol={selectedCoin2.symbol}
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