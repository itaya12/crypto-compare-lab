import { Coin } from "@/services/api";

interface CoinStatsProps {
  coin: Coin;
}

export const CoinStats = ({ coin }: CoinStatsProps) => {
  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="glass-card p-6 space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">{coin.name}</span>
        <span className="text-sm text-gray-400">Rank #{coin.rank}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-400">Price</span>
          <p className="text-lg font-semibold">
            ${parseFloat(coin.priceUsd).toFixed(2)}
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-400">24h Change</span>
          <p
            className={`text-lg font-semibold ${
              parseFloat(coin.changePercent24Hr) >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {parseFloat(coin.changePercent24Hr).toFixed(2)}%
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-400">Market Cap</span>
          <p className="text-lg font-semibold">
            {formatNumber(coin.marketCapUsd)}
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-400">24h Volume</span>
          <p className="text-lg font-semibold">
            {formatNumber(coin.volumeUsd24Hr)}
          </p>
        </div>
      </div>
    </div>
  );
};