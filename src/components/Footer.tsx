import { Facebook, Twitter, Linkedin, Instagram, Info, Lock, FileText } from "lucide-react";
import { LiveTicker } from "./LiveTicker";

export const Footer = () => {
  return (
    <footer className="w-full bg-crypto-card/80 backdrop-blur-md border-t border-white/10">
      <LiveTicker />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About</h3>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <a href="/risk-disclaimer" className="text-sm hover:text-crypto-accent">Risk Disclaimer</a>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <a href="/privacy" className="text-sm hover:text-crypto-accent">Privacy Policy</a>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <a href="/terms" className="text-sm hover:text-crypto-accent">Terms of Service</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-crypto-accent">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-crypto-accent">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-crypto-accent">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-crypto-accent">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Crypto Compare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};