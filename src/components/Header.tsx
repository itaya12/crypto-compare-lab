import { Bitcoin } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-crypto-card border-b border-white/10 py-4">
      <div className="container mx-auto px-4 flex items-center">
        <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
          <Bitcoin className="h-8 w-8" />
          <span className="text-xl font-bold">Crypto Compare</span>
        </Link>
      </div>
    </header>
  );
};