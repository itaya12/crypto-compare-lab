import { Button } from "@/components/ui/button";

type ChartType = "line" | "pie" | "heatmap" | "scatter" | "radar";

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
    "pie",
    "heatmap",
    "scatter",
    "radar",
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