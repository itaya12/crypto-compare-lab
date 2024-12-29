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
import { PieChart } from "./charts/PieChart";
import { TradingVolumePieChart } from "./charts/TradingVolumePieChart";
import { RadarChart } from "./charts/RadarChart";
import { AreaChart } from "./charts/AreaChart";
import { useIsMobile } from "@/hooks/use-mobile";

interface ComparisonChartProps {
  coinsData: CoinHistory[][];
  coinSymbols: string[];
  defaultChartType?: "line" | "pie" | "radar" | "area";
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
  const [chartType, setChartType] = useState<"line" | "pie" | "radar" | "area">(defaultChartType);
  const isMobile = useIsMobile();

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
    if (coinsData.length === 0) {
      return <div>Insufficient data for comparison</div>;
    }

    switch (chartType) {
      case "pie":
        return (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="min-h-[300px] md:min-h-[400px]">
              <PieChart
                coinsData={coinsData}
                coinSymbols={coinSymbols}
              />
            </div>
            <div className="min-h-[300px] md:min-h-[400px]">
              <TradingVolumePieChart
                coinsData={coinsData}
                coinSymbols={coinSymbols}
              />
            </div>
          </div>
        );
      case "radar":
        return (
          <div className="min-h-[300px] md:min-h-[400px]">
            <RadarChart
              coinsData={coinsData}
              coinSymbols={coinSymbols}
            />
          </div>
        );
      case "area":
        return (
          <div className="min-h-[300px] md:min-h-[400px]">
            <AreaChart
              coinsData={coinsData}
              coinSymbols={coinSymbols}
            />
          </div>
        );
      default:
        return (
          <div className="w-full min-h-[300px] md:min-h-[400px] glass-card p-4 md:p-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mergedData}>
                <XAxis
                  dataKey="time"
                  stroke="#9ca3af"
                  fontSize={isMobile ? 10 : 12}
                  tickLine={false}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={isMobile ? 60 : 30}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={isMobile ? 10 : 12}
                  tickLine={false}
                  tickFormatter={(value) => `${value.toFixed(2)}%`}
                  width={isMobile ? 45 : 60}
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
                <Legend 
                  wrapperStyle={{
                    paddingTop: isMobile ? "20px" : "10px",
                    fontSize: isMobile ? "12px" : "14px"
                  }}
                />
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