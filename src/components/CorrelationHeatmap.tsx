import { useMemo, useState } from "react";
import { CoinHistory } from "@/services/api";

interface CorrelationHeatmapProps {
  coinsData: CoinHistory[][];
  coinSymbols: string[];
}

const calculatePearsonCorrelation = (x: number[], y: number[]) => {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};

export const CorrelationHeatmap = ({ coinsData, coinSymbols }: CorrelationHeatmapProps) => {
  const correlationMatrix = useMemo(() => {
    const prices = coinsData.map(data => 
      data.map(point => parseFloat(point.priceUsd))
    );

    return prices.map((priceSeriesA, i) => 
      prices.map((priceSeriesB, j) => 
        calculatePearsonCorrelation(priceSeriesA, priceSeriesB)
      )
    );
  }, [coinsData]);

  const getCorrelationColor = (correlation: number) => {
    const hue = ((correlation + 1) * 120).toString(10);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const [hoveredCell, setHoveredCell] = useState<{ i: number; j: number } | null>(null);

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h3 className="text-xl font-semibold mb-4">Price Correlation Matrix</h3>
      <div className="overflow-x-auto">
        <div className="grid" style={{ 
          gridTemplateColumns: `auto ${coinSymbols.map(() => '1fr').join(' ')}`,
          gap: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}>
          <div className="p-2"></div>
          {coinSymbols.map(symbol => (
            <div key={symbol} className="p-2 text-center font-medium">
              {symbol}
            </div>
          ))}

          {correlationMatrix.map((row, i) => (
            <>
              <div key={`label-${i}`} className="p-2 font-medium">
                {coinSymbols[i]}
              </div>
              {row.map((correlation, j) => (
                <div
                  key={`${i}-${j}`}
                  className="p-2 text-center transition-all duration-200 cursor-pointer hover:scale-105"
                  style={{
                    backgroundColor: getCorrelationColor(correlation),
                    transform: hoveredCell?.i === i && hoveredCell?.j === j ? 'scale(1.05)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredCell({ i, j })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {correlation.toFixed(2)}
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <p>Correlation ranges from -1 (perfect negative correlation) to 1 (perfect positive correlation).</p>
        <p>0 indicates no correlation between price movements.</p>
      </div>
    </div>
  );
};
