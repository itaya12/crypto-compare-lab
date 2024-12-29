import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CoinHistory } from "@/services/api";

interface SingleCoinPriceChartProps {
  coinData: CoinHistory[];
  coinSymbol: string;
  color?: string;
}

export const SingleCoinPriceChart = ({ 
  coinData, 
  coinSymbol,
  color = "#6C5DD3"
}: SingleCoinPriceChartProps) => {
  const chartData = coinData.map((point) => ({
    time: new Date(point.time).toLocaleDateString(),
    price: parseFloat(point.priceUsd),
  }));

  const formatPrice = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}k`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="w-full h-[300px] glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">{coinSymbol} Price History</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
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
            tickFormatter={formatPrice}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2D2A3D",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
            }}
            labelStyle={{ color: "#9ca3af" }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};