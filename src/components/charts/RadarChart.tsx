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
  coinsData: CoinHistory[][];
  coinSymbols: string[];
}

const CHART_COLORS = [
  "#6C5DD3",
  "#118C4F",
  "#FFB800",
  "#FF4842",
  "#00A76F",
  "#7635DC",
];

export const RadarChart = ({
  coinsData,
  coinSymbols,
}: RadarChartProps) => {
  const getLatestMetrics = (data: CoinHistory[]) => {
    const latest = data[data.length - 1];
    if (!latest) return null;

    return {
      price: parseFloat(latest.priceUsd),
      volume: parseFloat(latest.date || "0"),
      supply: parseFloat(latest.circulatingSupply || "0"),
      marketCap: parseFloat(latest.marketCap || "0"),
    };
  };

  const normalizeValue = (value: number, maxValue: number) =>
    (value / maxValue) * 100;

  const metrics = coinsData.map(coinData => getLatestMetrics(coinData)).filter(Boolean);
  
  if (metrics.length === 0) return null;

  const maxValues = {
    price: Math.max(...metrics.map(m => m!.price)),
    volume: Math.max(...metrics.map(m => m!.volume)),
    supply: Math.max(...metrics.map(m => m!.supply)),
    marketCap: Math.max(...metrics.map(m => m!.marketCap)),
  };

  const data = [
    {
      metric: "Price",
      ...Object.fromEntries(
        metrics.map((m, i) => [coinSymbols[i], normalizeValue(m!.price, maxValues.price)])
      ),
    },
    {
      metric: "Volume",
      ...Object.fromEntries(
        metrics.map((m, i) => [coinSymbols[i], normalizeValue(m!.volume, maxValues.volume)])
      ),
    },
    {
      metric: "Supply",
      ...Object.fromEntries(
        metrics.map((m, i) => [coinSymbols[i], normalizeValue(m!.supply, maxValues.supply)])
      ),
    },
    {
      metric: "Market Cap",
      ...Object.fromEntries(
        metrics.map((m, i) => [coinSymbols[i], normalizeValue(m!.marketCap, maxValues.marketCap)])
      ),
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
          {coinSymbols.map((symbol, index) => (
            <Radar
              key={symbol}
              name={symbol}
              dataKey={symbol}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              fillOpacity={0.3}
            />
          ))}
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};