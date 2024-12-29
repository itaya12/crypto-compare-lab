import { useQuery } from "@tanstack/react-query";
import { fetchTopCoins } from "@/services/api";

export const LiveTicker = () => {
  const { data: coins = [] } = useQuery({
    queryKey: ["topCoins"],
    queryFn: fetchTopCoins,
  });

  const top15Coins = coins.slice(0, 15);

  return (
    <div className="bg-crypto-card/50 py-2 overflow-hidden border-t border-b border-white/10">
      <div className="animate-[slide_30s_linear_infinite] whitespace-nowrap">
        {top15Coins.map((coin, index) => (
          <span key={coin.id} className="inline-block mx-4">
            <span className="font-medium">{coin.symbol.toUpperCase()}</span>
            <span className={`ml-2 ${coin.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${coin.currentPrice.toLocaleString()} 
              ({coin.priceChangePercentage24h.toFixed(2)}%)
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};