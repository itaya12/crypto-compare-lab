import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
} from "recharts";
import { CoinHistory } from "@/services/api";

interface CandlestickChartProps {
  coin1Data: CoinHistory[];
  coin2Data: CoinHistory[];
  coin1Symbol: string;
  coin2Symbol: string;
}

export const CandlestickChart = ({
  coin1Data,
  coin2Data,
}: CandlestickChartProps) => {
  const processData = (data: CoinHistory[]) => {
    return data.map((point) => ({
      time: new Date(point.time).toLocaleDateString(),
      value: parseFloat(point.priceUsd),
      high: parseFloat(point.priceUsd) * 1.02, // Simulated high
      low: parseFloat(point.priceUsd) * 0.98, // Simulated low
    }));
  };

  const chartData = processData(coin1Data);

  return (
    <div className="w-full h-[400px] glass-card p-6">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
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
            domain={["dataMin", "dataMax"]}
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
          <Bar
            dataKey="high"
            fill="#6C5DD3"
            stroke="#6C5DD3"
            isAnimationActive={false}
          />
          <Bar
            dataKey="low"
            fill="#118C4F"
            stroke="#118C4F"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};