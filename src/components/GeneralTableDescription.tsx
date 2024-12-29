import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Coin } from "@/services/api";

interface GeneralTableDescriptionProps {
  coins: Coin[];
}

export const GeneralTableDescription = ({ coins }: GeneralTableDescriptionProps) => {
  const dataPoints = [
    { label: "Price", getValue: (coin: Coin) => `$${parseFloat(coin.priceUsd).toFixed(2)}` },
    { label: "Market Cap", getValue: (coin: Coin) => `$${parseFloat(coin.marketCapUsd).toFixed(2)}` },
    { label: "Current Supply", getValue: (coin: Coin) => parseFloat(coin.supply).toLocaleString() },
    { label: "Max Supply", getValue: (coin: Coin) => coin.maxSupply ? parseFloat(coin.maxSupply).toLocaleString() : "Unlimited" },
    { label: "Rank", getValue: (coin: Coin) => `#${coin.rank}` },
  ];

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h3 className="text-xl font-semibold mb-4">General Comparison</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data Point</TableHead>
            {coins.map((coin) => (
              <TableHead key={coin.id}>{coin.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataPoints.map((dataPoint) => (
            <TableRow key={dataPoint.label}>
              <TableCell className="font-medium">{dataPoint.label}</TableCell>
              {coins.map((coin) => (
                <TableCell key={coin.id}>{dataPoint.getValue(coin)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};