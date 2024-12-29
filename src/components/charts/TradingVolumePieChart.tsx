import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from "recharts";
import { CoinHistory } from "@/services/api";
import { useState } from "react";

interface TradingVolumePieChartProps {
  coinsData: CoinHistory[][];
  coinSymbols: string[];
}

const CHART_COLORS = [
  "#8B5CF6", // Vivid Purple
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
  "#0EA5E9", // Ocean Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#6366F1", // Indigo
  "#EC4899", // Pink
];

export const TradingVolumePieChart = ({
  coinsData,
  coinSymbols,
}: TradingVolumePieChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const calculateAverageVolume = (data: CoinHistory[]): number => {
    if (data.length === 0) return 0;
    const volumes = data.map(item => parseFloat(item.volumeUsd24Hr || "0"));
    return volumes.reduce((sum, volume) => sum + volume, 0) / data.length;
  };

  const getVolumeData = () => {
    return coinsData.map((coinData, index) => {
      const avgVolume = calculateAverageVolume(coinData);
      return {
        name: coinSymbols[index],
        value: avgVolume,
      };
    });
  };

  const data = getVolumeData();

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
      const volume = parseFloat(payload[0].value);
      const formattedVolume = volume >= 1e9 
        ? `$${(volume / 1e9).toFixed(2)}B`
        : volume >= 1e6
        ? `$${(volume / 1e6).toFixed(2)}M`
        : `$${volume.toFixed(2)}`;

      return (
        <div className="glass-card p-2">
          <p className="text-sm font-semibold">{`${payload[0].name}`}</p>
          <p className="text-xs text-gray-300">{`Volume: ${formattedVolume}`}</p>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="w-full h-[400px] glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Trading Volume</h3>
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
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            activeIndex={activeIndex}
            activeShape={(props) => {
              const RADIAN = Math.PI / 180;
              const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
              const sin = Math.sin(-RADIAN * midAngle);
              const cos = Math.cos(-RADIAN * midAngle);
              const sx = cx + (outerRadius + 10) * cos;
              const sy = cy + (outerRadius + 10) * sin;
              const mx = cx + (outerRadius + 30) * cos;
              const my = cy + (outerRadius + 30) * sin;
              const ex = mx + (cos >= 0 ? 1 : -1) * 22;
              const ey = my;
              const textAnchor = cos >= 0 ? 'start' : 'end';
              const volume = parseFloat(value);
              const formattedVolume = volume >= 1e9 
                ? `$${(volume / 1e9).toFixed(2)}B`
                : volume >= 1e6
                ? `$${(volume / 1e6).toFixed(2)}M`
                : `$${volume.toFixed(2)}`;

              return (
                <g>
                  <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload.name}
                  </text>
                  <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 10}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                  />
                  <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                  />
                  <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                  <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                  <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#999">
                    {`Volume: ${formattedVolume}`}
                  </text>
                  <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${(percent * 100).toFixed(2)}%)`}
                  </text>
                </g>
              );
            }}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
