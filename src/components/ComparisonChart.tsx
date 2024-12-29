import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CoinHistory } from "@/services/api";
import { ChartTypeSelector } from "./ChartTypeSelector";
import { CandlestickChart } from "./charts/CandlestickChart";
import { BarChart } from "./charts/BarChart";
import { PieChart } from "./charts/PieChart";

interface ComparisonChartProps {
  coin1Data: CoinHistory[];
  coin2Data: CoinHistory[];
  coin1Symbol: string;
  coin2Symbol: string;
}

export const ComparisonChart = ({
  coin1Data,
  coin2Data,
  coin1Symbol,
  coin2Symbol,
}: ComparisonChartProps) => {
  const [chartType, setChartType] = useState<
    "line" | "candlestick" | "bar" | "pie" | "heatmap" | "scatter"
  >("line");

  // Normalize data to percentage change from first price
  const normalizeData = (data: CoinHistory[]) => {
    if (data.length === 0) return [];
    const firstPrice = parseFloat(data[0].priceUsd);
    return data.map((point) => ({
      time: new Date(point.time).toLocaleDateString(),
      price: ((parseFloat(point.priceUsd) - firstPrice) / firstPrice) * 100,
    }));
  };

  const coin1Normalized = normalizeData(coin1Data);
  const coin2Normalized = normalizeData(coin2Data);

  // Merge data points
  const mergedData = coin1Normalized.map((point, i) => ({
    time: point.time,
    [coin1Symbol]: point.price,
    [coin2Symbol]: coin2Normalized[i]?.price || 0,
  }));

  const renderChart = () => {
    switch (chartType) {
      case "candlestick":
        return (
          <CandlestickChart
            coin1Data={coin1Data}
            coin2Data={coin2Data}
            coin1Symbol={coin1Symbol}
            coin2Symbol={coin2Symbol}
          />
        );
      case "bar":
        return (
          <BarChart
            coin1Data={coin1Data}
            coin2Data={coin2Data}
            coin1Symbol={coin1Symbol}
            coin2Symbol={coin2Symbol}
          />
        );
      case "pie":
        return (
          <PieChart
            coin1Data={coin1Data}
            coin2Data={coin2Data}
            coin1Symbol={coin1Symbol}
            coin2Symbol={coin2Symbol}
          />
        );
      default:
        return (
          <div className="w-full h-[400px] glass-card p-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mergedData}>
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
                  tickFormatter={(value) => `${value.toFixed(2)}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2D2A3D",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={coin1Symbol}
                  stroke="#6C5DD3"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={coin2Symbol}
                  stroke="#118C4F"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <ChartTypeSelector selectedType={chartType} onSelect={setChartType} />
      {renderChart()}
    </div>
  );
};