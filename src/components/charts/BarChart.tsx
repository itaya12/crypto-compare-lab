import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CoinHistory } from "@/services/api";

interface BarChartProps {
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

export const BarChart = ({
  coinsData,
  coinSymbols,
}: BarChartProps) => {
  const processData = (data: CoinHistory[][]) => {
    if (!data[0]?.length) return [];
    
    return data[0].map((_, timeIndex) => {
      const point: any = {
        time: new Date(data[0][timeIndex].time).toLocaleDateString(),
      };
      
      data.forEach((coinData, coinIndex) => {
        point[coinSymbols[coinIndex]] = parseFloat(coinData[timeIndex]?.priceUsd || '0');
      });
      
      return point;
    });
  };

  const chartData = processData(coinsData);

  return (
    <div className="w-full h-[400px] glass-card p-6">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={chartData}>
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
          />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
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
            <Bar
              key={symbol}
              dataKey={symbol}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};