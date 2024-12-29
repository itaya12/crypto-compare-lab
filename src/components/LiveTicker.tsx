import { useQuery } from "@tanstack/react-query";
import { fetchTopCoins } from "@/services/api";

export const LiveTicker = () => {
  const { data: coins = [] } = useQuery({
    queryKey: ["topCoins"],
    queryFn: fetchTopCoins,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const top15Coins = coins.slice(0, 15);

  return (
    <div className="w-full overflow-hidden bg-crypto-card/60 py-2">
      <div className="animate-[slide_20s_linear_infinite] whitespace-nowrap">
        {top15Coins.map((coin) => (
          <span key={coin.id} className="inline-block mx-4">
            <span className="font-medium">{coin.symbol.toUpperCase()}</span>
            <span className={`ml-2 ${parseFloat(coin.changePercent24Hr) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${parseFloat(coin.priceUsd).toFixed(2)} ({parseFloat(coin.changePercent24Hr).toFixed(2)}%)
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};