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
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SingleCoinPriceChartProps {
  coinData: CoinHistory[];
  coinSymbol: string;
  color?: string;
}

type TimeFrame = "1w" | "1m" | "6m";

export const SingleCoinPriceChart = ({ 
  coinData, 
  coinSymbol,
  color = "#6C5DD3"
}: SingleCoinPriceChartProps) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1w");
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);

  const filterDataByTimeFrame = (data: CoinHistory[], frame: TimeFrame) => {
    const now = Date.now();
    const timeFrames = {
      "1w": 7 * 24 * 60 * 60 * 1000,
      "1m": 30 * 24 * 60 * 60 * 1000,
      "6m": 180 * 24 * 60 * 60 * 1000
    };
    
    return data.filter(point => 
      now - new Date(point.time).getTime() <= timeFrames[frame]
    );
  };

  const filteredData = filterDataByTimeFrame(coinData, timeFrame);
  
  const chartData = filteredData.map((point) => ({
    time: new Date(point.time).toLocaleDateString(),
    price: parseFloat(point.priceUsd),
  }));

  const calculatePercentageChange = (data: typeof chartData, days: number) => {
    if (data.length < 2) return 0;
    const endIndex = data.length - 1;
    const startIndex = Math.max(0, endIndex - days);
    const firstPrice = data[startIndex].price;
    const lastPrice = data[endIndex].price;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };

  const percentageChanges = {
    "1d": calculatePercentageChange(chartData, 1),
    "3d": calculatePercentageChange(chartData, 3),
    "1w": calculatePercentageChange(chartData, 7),
    "1m": calculatePercentageChange(chartData, 30),
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}k`;
    return `$${value.toFixed(2)}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const PriceChangeIndicator = ({ change, label }: { change: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-400">{label}</span>
      <div className={`flex items-center gap-1 ${change >= 0 ? 'text-crypto-success' : 'text-crypto-error'}`}>
        {change >= 0 ? (
          <ArrowUpIcon className="w-3 h-3" />
        ) : (
          <ArrowDownIcon className="w-3 h-3" />
        )}
        <span className="font-medium text-sm">
          {Math.abs(change).toFixed(1)}%
        </span>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 !bg-crypto-card border-none">
          <p className="text-sm text-gray-400">{formatDate(data.time)}</p>
          <p className="text-lg font-semibold">{formatPrice(data.price)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] glass-card p-6 hover:border-crypto-accent/50 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{coinSymbol} Price</h3>
          <p className="text-2xl font-bold">
            {formatPrice(hoveredPrice || chartData[chartData.length - 1]?.price || 0)}
          </p>
        </div>
        <div className={`flex items-center gap-1 ${percentageChanges["1d"] >= 0 ? 'text-crypto-success' : 'text-crypto-error'}`}>
          {percentageChanges["1d"] >= 0 ? (
            <ArrowUpIcon className="w-4 h-4" />
          ) : (
            <ArrowDownIcon className="w-4 h-4" />
          )}
          <span className="font-medium">
            {Math.abs(percentageChanges["1d"]).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2 mb-4">
        {(["1w", "1m", "6m"] as TimeFrame[]).map((frame) => (
          <Button
            key={frame}
            variant={timeFrame === frame ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFrame(frame)}
            className={timeFrame === frame ? "bg-crypto-accent hover:bg-crypto-accent/90" : ""}
          >
            {frame}
          </Button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height="70%">
        <LineChart 
          data={chartData}
          onMouseMove={(e: any) => {
            if (e.activePayload) {
              setHoveredPrice(e.activePayload[0].payload.price);
            }
          }}
          onMouseLeave={() => setHoveredPrice(null)}
        >
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
            tickFormatter={formatDate}
            minTickGap={30}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatPrice}
            domain={['auto', 'auto']}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={(props) => (
              <Dot {...props} stroke={color} fill={color} strokeWidth={2} r={4} />
            )}
            fill={`url(#gradient-${coinSymbol})`}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex justify-between mt-6 px-4">
        {Object.entries(percentageChanges).map(([label, change]) => (
          <PriceChangeIndicator key={label} change={change} label={label} />
        ))}
      </div>
    </div>
  );
};