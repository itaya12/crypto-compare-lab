import { CoinHistory } from "@/services/api";
import { ComparisonChart } from "./ComparisonChart";
import { CorrelationHeatmap } from "./CorrelationHeatmap";
import { SingleCoinPriceChart } from "./charts/SingleCoinPriceChart";
import { GeneralTableDescription } from "./GeneralTableDescription";

interface ChartSectionProps {
  coinsHistory: CoinHistory[][];
  coinSymbols: string[];
  coins: any[]; // Adding coins prop for GeneralTableDescription
}

const CHART_TYPES = ["line", "area", "pie", "radar"] as const;

const CHART_COLORS = [
  "#6C5DD3",
  "#118C4F",
  "#FFB800",
  "#FF4842",
  "#00A76F",
  "#7635DC",
];

export const ChartSection = ({ coinsHistory, coinSymbols, coins }: ChartSectionProps) => {
  return (
    <div className="space-y-24">
      <div className="scroll-mt-8">
        <h2 className="text-2xl font-bold mb-6">General Comparison</h2>
        <GeneralTableDescription coins={coins} />
      </div>

      <div className="scroll-mt-8">
        <h2 className="text-2xl font-bold mb-6">Individual Price Charts</h2>
        <div className="grid grid-cols-1 gap-6">
          {coinsHistory.map((coinHistory, index) => (
            <SingleCoinPriceChart
              key={coinSymbols[index]}
              coinData={coinHistory}
              coinSymbol={coinSymbols[index]}
              color={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </div>
      </div>

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