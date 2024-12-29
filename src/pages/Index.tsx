import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Coin, fetchTopCoins, fetchCoinHistory } from "@/services/api";
import { ComparisonChart } from "@/components/ComparisonChart";
import { CoinStats } from "@/components/CoinStats";
import { Share2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CoinSelectionArea } from "@/components/CoinSelectionArea";

const Index = () => {
  const [selectedCoins, setSelectedCoins] = useState<(Coin | null)[]>([null, null]);
  const [additionalCoins, setAdditionalCoins] = useState<(Coin | null)[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { data: coins = [] } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchTopCoins,
  });

  const queries = [...selectedCoins, ...additionalCoins].map((coin, index) => {
    const coinId = coin?.id;
    return useQuery({
      queryKey: ["coinHistory", coinId, startDate, endDate],
      queryFn: () => fetchCoinHistory(coinId || "", startDate.getTime(), endDate.getTime()),
      enabled: !!coinId,
    });
  });

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

  const handleUpdateCoin = (index: number, coin: Coin, isAdditional: boolean) => {
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

  const handleRemoveCoin = (index: number) => {
    const newAdditionalCoins = [...additionalCoins];
    newAdditionalCoins.splice(index, 1);
    setAdditionalCoins(newAdditionalCoins);
  };

  const handleAddCoin = () => {
    setAdditionalCoins([...additionalCoins, null]);
  };

  const handleCompareAll = () => {
    const allCoins = [...selectedCoins, ...additionalCoins].filter(coin => coin !== null) as Coin[];
    setSelectedCoins(allCoins);
    setAdditionalCoins([]);
    setShowComparison(true);
  };

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

        <CoinSelectionArea
          selectedCoins={selectedCoins}
          additionalCoins={additionalCoins}
          coins={coins}
          onUpdateCoin={handleUpdateCoin}
          onRemoveCoin={handleRemoveCoin}
          onAddCoin={handleAddCoin}
          onCompareAll={handleCompareAll}
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