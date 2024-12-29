import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CoinHistory } from "@/services/api";

interface PieChartProps {
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

export const PieChart = ({
  coinsData,
  coinSymbols,
}: PieChartProps) => {
  const getLatestValues = () => {
    return coinsData.map((coinData, index) => ({
      name: coinSymbols[index],
      value: coinData.length > 0 ? parseFloat(coinData[coinData.length - 1].priceUsd) : 0,
    }));
  };

  const data = getLatestValues();

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${data[index].name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="w-full h-[400px] glass-card p-6">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};