import { CoinHistory } from "@/services/api";
import { ComparisonChart } from "./ComparisonChart";
import { CorrelationHeatmap } from "./CorrelationHeatmap";

interface ChartSectionProps {
  coinsHistory: CoinHistory[][];
  coinSymbols: string[];
  chartTypes: readonly ("line" | "pie" | "radar" | "area")[];
}

export const ChartSection = ({ coinsHistory, coinSymbols, chartTypes }: ChartSectionProps) => {
  return (
    <div className="space-y-24">
      <div className="scroll-mt-8">
        <h2 className="text-2xl font-bold mb-6">Correlation Analysis</h2>
        <CorrelationHeatmap
          coinsData={coinsHistory}
          coinSymbols={coinSymbols}
        />
      </div>

      <div className="scroll-mt-8">
        <ComparisonChart
          coinsData={coinsHistory}
          coinSymbols={coinSymbols}
          defaultChartType={chartTypes[0]}
        />
      </div>
    </div>
  );
};