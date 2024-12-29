import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CoinHistory } from "@/services/api";

interface AreaChartProps {
  coin1Data: CoinHistory[];
  coin2Data: CoinHistory[];
  coin1Symbol: string;
  coin2Symbol: string;
}

export const AreaChart = ({
  coin1Data,
  coin2Data,
  coin1Symbol,
  coin2Symbol,
}: AreaChartProps) => {
  const processData = (data: CoinHistory[]) => {
    return data.map((point) => ({
      time: new Date(point.time).toLocaleDateString(),
      value: parseFloat(point.priceUsd),
    }));
  };

  const mergedData = processData(coin1Data).map((point, i) => ({
    time: point.time,
    [coin1Symbol]: point.value,
    [coin2Symbol]: processData(coin2Data)[i]?.value || 0,
  }));

  return (
    <div className="w-full h-[400px] glass-card p-6">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={mergedData}>
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
          <Area
            type="monotone"
            dataKey={coin1Symbol}
            fill="#6C5DD3"
            stroke="#6C5DD3"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey={coin2Symbol}
            fill="#118C4F"
            stroke="#118C4F"
            fillOpacity={0.3}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};