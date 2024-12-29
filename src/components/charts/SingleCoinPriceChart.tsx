import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { CoinHistory } from "@/services/api";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

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

  const calculatePercentageChange = (data: typeof chartData) => {
    if (data.length < 2) return 0;
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };

  const percentageChange = calculatePercentageChange(chartData);
  const isPositive = percentageChange >= 0;

  const formatPrice = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}k`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="w-full h-[300px] glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{coinSymbol} Price</h3>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-crypto-success' : 'text-crypto-error'}`}>
          {isPositive ? (
            <ArrowUpIcon className="w-4 h-4" />
          ) : (
            <ArrowDownIcon className="w-4 h-4" />
          )}
          <span className="font-medium">
            {Math.abs(percentageChange).toFixed(1)}%
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${coinSymbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
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
            activeDot={(props) => (
              <Dot {...props} stroke={color} strokeWidth={2} r={4} />
            )}
            fill={`url(#gradient-${coinSymbol})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};