import { useQuery } from "@tanstack/react-query";
import { fetchTopCoins } from "@/services/api";

export const LiveTicker = () => {
  const { data: coins = [] } = useQuery({
    queryKey: ["topCoins"],
    queryFn: fetchTopCoins,
    refetchInterval: 30000, // Refetch every 30 seconds to avoid rate limiting
  });

  const top15Coins = coins.slice(0, 15);

  return (
    <div className="bg-crypto-card/50 py-2 overflow-hidden border-t border-b border-white/10">
      <div className="animate-[slide_30s_linear_infinite] whitespace-nowrap">
        {top15Coins.map((coin, index) => (
          <span key={coin.id} className="inline-block mx-4">
            <span className="font-medium">{coin.symbol.toUpperCase()}</span>
            <span className={`ml-2 ${parseFloat(coin.changePercent24Hr) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${parseFloat(coin.priceUsd).toLocaleString()} 
              ({parseFloat(coin.changePercent24Hr).toFixed(2)}%)
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};