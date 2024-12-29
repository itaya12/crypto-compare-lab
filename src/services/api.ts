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
  volumeUsd24Hr?: string;
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
    // First, get the current data for the coin to get the latest volume
    const currentResponse = await fetch(`${BASE_URL}/assets/${coinId}`);
    const currentData = await currentResponse.json();
    const currentVolume = currentData.data?.volumeUsd24Hr || "0";

    // Then get the historical price data
    const historyResponse = await fetch(
      `${BASE_URL}/assets/${coinId}/history?interval=${interval}&start=${start}&end=${end}`
    );
    const historyData = await historyResponse.json();

    return historyData.data.map((item: any) => ({
      ...item,
      date: new Date(item.time).toLocaleDateString(),
      marketCap: item.priceUsd * item.circulatingSupply,
      volumeUsd24Hr: currentVolume, // Use the current volume for historical entries
    }));
  } catch (error) {
    toast.error(`Failed to fetch history for ${coinId}`);
    return [];
  }
};