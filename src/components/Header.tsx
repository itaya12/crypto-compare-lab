import { Bitcoin } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="w-full bg-crypto-card/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Bitcoin className="h-8 w-8 text-crypto-accent" />
              <span className="text-xl font-bold">Crypto Compare</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};