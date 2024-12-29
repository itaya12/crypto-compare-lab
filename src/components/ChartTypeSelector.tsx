import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChartTypeSelectorProps {
  selectedType: "line" | "pie" | "radar" | "area";
  onSelect: (type: "line" | "pie" | "radar" | "area") => void;
}

export const ChartTypeSelector = ({ selectedType, onSelect }: ChartTypeSelectorProps) => {
  const types = [
    { id: "line", label: "Line Chart" },
    { id: "area", label: "Area Chart" },
    { id: "pie", label: "Pie Chart" },
    { id: "radar", label: "Radar Chart" },
  ] as const;

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {types.map((type) => (
        <Button
          key={type.id}
          variant="outline"
          onClick={() => onSelect(type.id)}
          className={cn(
            "min-w-[120px]",
            selectedType === type.id && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
};