import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CoinHistory } from "@/services/api";

interface PieChartProps {
  coin1Data: CoinHistory[];
  coin2Data: CoinHistory[];
  coin1Symbol: string;
  coin2Symbol: string;
}

export const PieChart = ({
  coin1Data,
  coin2Data,
  coin1Symbol,
  coin2Symbol,
}: PieChartProps) => {
  const getLatestValue = (data: CoinHistory[]) => {
    return data.length > 0 ? parseFloat(data[data.length - 1].priceUsd) : 0;
  };

  const data = [
    { name: coin1Symbol, value: getLatestValue(coin1Data) },
    { name: coin2Symbol, value: getLatestValue(coin2Data) },
  ];

  const COLORS = ["#6C5DD3", "#118C4F"];

  return (
    <div className="w-full h-[400px] glass-card p-6">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#2D2A3D",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
            }}
            labelStyle={{ color: "#9ca3af" }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};