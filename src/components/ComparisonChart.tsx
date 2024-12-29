import { useState, useEffect } from "react";
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
import { CandlestickChart } from "./charts/CandlestickChart";
import { BarChart } from "./charts/BarChart";
import { PieChart } from "./charts/PieChart";
import { AreaChart } from "./charts/AreaChart";
import { RadarChart } from "./charts/RadarChart";

interface ComparisonChartProps {
  coinsData: CoinHistory[][];
  coinSymbols: string[];
  defaultChartType?: "line" | "candlestick" | "bar" | "pie" | "area" | "radar";
}

const CHART_COLORS = [
  "#6C5DD3",
  "#118C4F",
  "#FFB800",
  "#FF4842",
  "#00A76F",
  "#7635DC",
];

export const ComparisonChart = ({
  coinsData,
  coinSymbols,
  defaultChartType = "line",
}: ComparisonChartProps) => {
  const [chartType, setChartType] = useState<
    "line" | "candlestick" | "bar" | "pie" | "area" | "radar"
  >(defaultChartType);

  useEffect(() => {
    setChartType(defaultChartType);
  }, [defaultChartType]);

  const normalizeData = (data: CoinHistory[]) => {
    if (data.length === 0) return [];
    const firstPrice = parseFloat(data[0].priceUsd);
    return data.map((point) => ({
      time: new Date(point.time).toLocaleDateString(),
      price: ((parseFloat(point.priceUsd) - firstPrice) / firstPrice) * 100,
    }));
  };

  const normalizedData = coinsData.map(data => normalizeData(data));

  // Merge data points
  const mergedData = normalizedData[0].map((point, timeIndex) => {
    const dataPoint: { [key: string]: any } = {
      time: point.time,
    };
    normalizedData.forEach((coinData, coinIndex) => {
      dataPoint[coinSymbols[coinIndex]] = coinData[timeIndex]?.price || 0;
    });
    return dataPoint;
  });

  const renderChart = () => {
    // Ensure we have at least two coins' data
    if (coinsData.length < 2 || !coinsData[0] || !coinsData[1]) {
      return <div>Insufficient data for comparison</div>;
    }

    switch (chartType) {
      case "candlestick":
        return (
          <CandlestickChart
            coin1Data={coinsData[0]}
            coin2Data={coinsData[1]}
            coin1Symbol={coinSymbols[0]}
            coin2Symbol={coinSymbols[1]}
          />
        );
      case "bar":
        return (
          <BarChart
            coin1Data={coinsData[0]}
            coin2Data={coinsData[1]}
            coin1Symbol={coinSymbols[0]}
            coin2Symbol={coinSymbols[1]}
          />
        );
      case "pie":
        return (
          <PieChart
            coin1Data={coinsData[0]}
            coin2Data={coinsData[1]}
            coin1Symbol={coinSymbols[0]}
            coin2Symbol={coinSymbols[1]}
          />
        );
      case "area":
        return (
          <AreaChart
            coin1Data={coinsData[0]}
            coin2Data={coinsData[1]}
            coin1Symbol={coinSymbols[0]}
            coin2Symbol={coinSymbols[1]}
          />
        );
      case "radar":
        return (
          <RadarChart
            coin1Data={coinsData[0]}
            coin2Data={coinsData[1]}
            coin1Symbol={coinSymbols[0]}
            coin2Symbol={coinSymbols[1]}
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
                {coinSymbols.map((symbol, index) => (
                  <Line
                    key={symbol}
                    type="monotone"
                    dataKey={symbol}
                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {renderChart()}
    </div>
  );
};