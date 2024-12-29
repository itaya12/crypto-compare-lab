import { Button } from "@/components/ui/button";

type ChartType = "line" | "candlestick" | "bar" | "pie" | "heatmap" | "scatter";

interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onSelect: (type: ChartType) => void;
}

export const ChartTypeSelector = ({
  selectedType,
  onSelect,
}: ChartTypeSelectorProps) => {
  const chartTypes: ChartType[] = [
    "line",
    "candlestick",
    "bar",
    "pie",
    "heatmap",
    "scatter",
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chartTypes.map((type) => (
        <Button
          key={type}
          variant={selectedType === type ? "default" : "outline"}
          onClick={() => onSelect(type)}
          className="capitalize"
        >
          {type}
        </Button>
      ))}
    </div>
  );
};