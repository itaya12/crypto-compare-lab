import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CoinHistory } from "@/services/api";

interface PieChartProps {
  coinsData: CoinHistory[][];
  coinSymbols: string[];
}

const CHART_COLORS = [
  "#6C5DD3", // Vivid Purple
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
  "#0EA5E9", // Ocean Blue
  "#8E9196", // Neutral Gray
  "#E5DEFF", // Soft Purple
];

export const PieChart = ({
  coinsData,
  coinSymbols,
}: PieChartProps) => {
  const calculateVolatility = (prices: number[]): number => {
    if (prices.length < 2) return 0;
    
    // Calculate daily returns
    const returns = prices.slice(1).map((price, index) => {
      const previousPrice = prices[index];
      return ((price - previousPrice) / previousPrice) * 100;
    });
    
    // Calculate standard deviation (volatility)
    const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
    const squaredDiffs = returns.map(value => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / returns.length;
    return Math.sqrt(variance);
  };

  const getVolatilityData = () => {
    return coinsData.map((coinData, index) => {
      const prices = coinData.map(data => parseFloat(data.priceUsd));
      const volatility = calculateVolatility(prices);
      return {
        name: coinSymbols[index],
        value: volatility,
      };
    });
  };

  const data = getVolatilityData();

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
        {`${data[index].name} (${(percent * 100).toFixed(1)}%)`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-2">
          <p className="text-sm font-semibold">{`${payload[0].name}`}</p>
          <p className="text-xs text-gray-300">{`Volatility: ${payload[0].value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Volatility Comparison</h3>
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
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};