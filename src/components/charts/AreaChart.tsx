import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CoinHistory } from "@/services/api";

interface AreaChartProps {
  coinsData: CoinHistory[][];
  coinSymbols: string[];
}

const CHART_COLORS = [
  "#0EA5E9", // Ocean Blue
  "#8B5CF6", // Vivid Purple
  "#F2FCE2", // Soft Green
  "#FEF7CD", // Soft Yellow
  "#FEC6A1", // Soft Orange
  "#E5DEFF", // Soft Purple
];

export const AreaChart = ({ coinsData, coinSymbols }: AreaChartProps) => {
  const mergedData = coinsData[0].map((_, timeIndex) => {
    const dataPoint: { [key: string]: any } = {
      time: new Date(coinsData[0][timeIndex].time).toLocaleDateString(),
    };
    
    coinsData.forEach((coinData, coinIndex) => {
      const marketCap = parseFloat(coinData[timeIndex]?.marketCap || "0");
      dataPoint[`${coinSymbols[coinIndex]}_marketCap`] = marketCap;
      
      const volume = parseFloat(coinData[timeIndex]?.volumeUsd24Hr || "0");
      dataPoint[`${coinSymbols[coinIndex]}_volume`] = volume;
    });
    
    return dataPoint;
  });

  const formatValue = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="w-full h-[400px] glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Market Capitalization Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            tickFormatter={formatValue}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2D2A3D",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
            }}
            labelStyle={{ color: "#9ca3af" }}
            formatter={(value: number) => formatValue(value)}
            cursor={{ strokeDasharray: "3 3" }}
            wrapperStyle={{ zIndex: 100 }}
            animationDuration={200}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            onClick={(data) => {
              console.log("Legend clicked:", data);
            }}
          />
          {coinSymbols.map((symbol, index) => (
            <Area
              key={symbol}
              type="monotone"
              dataKey={`${symbol}_marketCap`}
              name={`${symbol} Market Cap`}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              fillOpacity={0.3}
              stackId="1"
              animationDuration={1500}
              animationBegin={index * 200}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};