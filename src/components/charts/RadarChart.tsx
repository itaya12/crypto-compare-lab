import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CoinHistory } from "@/services/api";

interface RadarChartProps {
  coin1Data: CoinHistory[];
  coin2Data: CoinHistory[];
  coin1Symbol: string;
  coin2Symbol: string;
}

export const RadarChart = ({
  coin1Data,
  coin2Data,
  coin1Symbol,
  coin2Symbol,
}: RadarChartProps) => {
  const getLatestMetrics = (data: CoinHistory[]) => {
    const latest = data[data.length - 1];
    if (!latest) return null;

    return {
      price: parseFloat(latest.priceUsd),
      volume: parseFloat(latest.volumeUsd24Hr || "0"),
      supply: parseFloat(latest.supply || "0"),
      marketCap: parseFloat(latest.marketCapUsd || "0"),
    };
  };

  const coin1Metrics = getLatestMetrics(coin1Data);
  const coin2Metrics = getLatestMetrics(coin2Data);

  if (!coin1Metrics || !coin2Metrics) return null;

  // Normalize values between 0 and 100 for better visualization
  const normalizeValue = (value: number, maxValue: number) =>
    (value / maxValue) * 100;

  const maxValues = {
    price: Math.max(coin1Metrics.price, coin2Metrics.price),
    volume: Math.max(coin1Metrics.volume, coin2Metrics.volume),
    supply: Math.max(coin1Metrics.supply, coin2Metrics.supply),
    marketCap: Math.max(coin1Metrics.marketCap, coin2Metrics.marketCap),
  };

  const data = [
    {
      metric: "Price",
      [coin1Symbol]: normalizeValue(coin1Metrics.price, maxValues.price),
      [coin2Symbol]: normalizeValue(coin2Metrics.price, maxValues.price),
    },
    {
      metric: "Volume",
      [coin1Symbol]: normalizeValue(coin1Metrics.volume, maxValues.volume),
      [coin2Symbol]: normalizeValue(coin2Metrics.volume, maxValues.volume),
    },
    {
      metric: "Supply",
      [coin1Symbol]: normalizeValue(coin1Metrics.supply, maxValues.supply),
      [coin2Symbol]: normalizeValue(coin2Metrics.supply, maxValues.supply),
    },
    {
      metric: "Market Cap",
      [coin1Symbol]: normalizeValue(coin1Metrics.marketCap, maxValues.marketCap),
      [coin2Symbol]: normalizeValue(coin2Metrics.marketCap, maxValues.marketCap),
    },
  ];

  return (
    <div className="w-full h-[400px] glass-card p-6">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#4B5563" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#9ca3af" }} />
          <Radar
            name={coin1Symbol}
            dataKey={coin1Symbol}
            stroke="#6C5DD3"
            fill="#6C5DD3"
            fillOpacity={0.3}
          />
          <Radar
            name={coin2Symbol}
            dataKey={coin2Symbol}
            stroke="#118C4F"
            fill="#118C4F"
            fillOpacity={0.3}
          />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};