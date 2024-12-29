import { toast } from "sonner";

const BASE_URL = "https://api.coincap.io/v2";

export interface Coin {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  changePercent24Hr: string;
}

export interface CoinHistory {
  priceUsd: string;
  time: number;
  date?: string;
  circulatingSupply?: string;
  marketCap?: string;
  volumeUsd24Hr?: string;  // Added this property
}

export const fetchTopCoins = async (): Promise<Coin[]> => {
  try {
    const response = await fetch(`${BASE_URL}/assets?limit=50`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    toast.error("Failed to fetch coins");
    return [];
  }
};

export const fetchCoinHistory = async (
  coinId: string,
  start: number = Date.now() - 7 * 24 * 60 * 60 * 1000,
  end: number = Date.now(),
  interval: string = "h1",
): Promise<CoinHistory[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/assets/${coinId}/history?interval=${interval}&start=${start}&end=${end}`
    );
    const data = await response.json();
    return data.data.map((item: any) => ({
      ...item,
      date: new Date(item.time).toLocaleDateString(),
      marketCap: item.priceUsd * item.circulatingSupply,
      volumeUsd24Hr: item.volumeUsd24Hr || "0", // Added this property mapping
    }));
  } catch (error) {
    toast.error(`Failed to fetch history for ${coinId}`);
    return [];
  }
};