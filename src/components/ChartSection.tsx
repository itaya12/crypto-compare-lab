import { CoinHistory } from "@/services/api";
import { ComparisonChart } from "./ComparisonChart";
import { CorrelationHeatmap } from "./CorrelationHeatmap";

interface ChartSectionProps {
  coinsHistory: CoinHistory[][];
  coinSymbols: string[];
}

const CHART_TYPES = ["line", "area", "pie", "radar"] as const;

export const ChartSection = ({ coinsHistory, coinSymbols }: ChartSectionProps) => {
  return (
    <div className="space-y-24">
      <div className="scroll-mt-8">
        <h2 className="text-2xl font-bold mb-6">Correlation Analysis</h2>
        <CorrelationHeatmap
          coinsData={coinsHistory}
          coinSymbols={coinSymbols}
        />
      </div>

      {CHART_TYPES.map((chartType) => (
        <div key={chartType} className="scroll-mt-8" id={chartType}>
          <h2 className="text-2xl font-bold mb-6 capitalize">{chartType} Chart</h2>
          <ComparisonChart
            coinsData={coinsHistory}
            coinSymbols={coinSymbols}
            defaultChartType={chartType}
          />
        </div>
      ))}
    </div>
  );
};