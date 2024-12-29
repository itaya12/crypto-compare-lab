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
  supply: string;
  maxSupply: string | null;
}

export interface CoinHistory {
  priceUsd: string;
  time: number;
  date?: string;
  circulatingSupply?: string;
  marketCap?: string;
  volumeUsd24Hr?: string;
}

const validateCoinData = (coin: any): boolean => {
  return (
    coin.priceUsd !== null &&
    coin.priceUsd !== undefined &&
    !isNaN(parseFloat(coin.priceUsd)) &&
    coin.marketCapUsd !== null &&
    coin.volumeUsd24Hr !== null &&
    coin.changePercent24Hr !== null
  );
};

export const fetchTopCoins = async (): Promise<Coin[]> => {
  try {
    const response = await fetch(`${BASE_URL}/assets?limit=2000`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }
    
    // Filter out coins with invalid or missing data
    const validCoins = data.data.filter(validateCoinData);
    console.log(`Fetched ${validCoins.length} valid coins out of ${data.data.length} total coins`);
    
    if (validCoins.length === 0) {
      toast.error("No valid coin data available");
      return [];
    }
    
    return validCoins;
  } catch (error) {
    console.error('Error fetching coins:', error);
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
    
    if (!currentResponse.ok || !currentData.data) {
      console.warn(`No current data available for ${coinId}`);
      return [];
    }

    const currentVolume = currentData.data?.volumeUsd24Hr || "0";

    // Then get the historical price data
    const historyResponse = await fetch(
      `${BASE_URL}/assets/${coinId}/history?interval=${interval}&start=${start}&end=${end}`
    );
    const historyData = await historyResponse.json();

    if (!historyResponse.ok || !historyData.data || historyData.data.length === 0) {
      console.warn(`No historical data available for ${coinId}`);
      toast.error(`No historical data available for ${coinId}`);
      return [];
    }

    // Filter out any invalid data points
    const validHistoryData = historyData.data.filter((item: any) => 
      item.priceUsd !== null && 
      !isNaN(parseFloat(item.priceUsd))
    );

    if (validHistoryData.length === 0) {
      toast.error(`No valid historical data for ${coinId}`);
      return [];
    }

    return validHistoryData.map((item: any) => ({
      ...item,
      date: new Date(item.time).toLocaleDateString(),
      marketCap: item.priceUsd * (item.circulatingSupply || 0),
      volumeUsd24Hr: currentVolume,
    }));
  } catch (error) {
    console.error('Error fetching coin history:', error);
    toast.error(`Failed to fetch history for ${coinId}`);
    return [];
  }
};