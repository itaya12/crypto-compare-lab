import { toast } from "sonner";

const BASE_URL = "https://api.coincap.io/v2";
const COINGECKO_URL = "https://api.coingecko.com/api/v3";

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
  imageUrl?: string;
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = 3, backoff = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.status === 429) {
        console.warn(`Rate limited, attempt ${i + 1} of ${retries}. Waiting ${backoff}ms...`);
        await delay(backoff);
        backoff *= 2; // Exponential backoff
        continue;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(backoff);
      backoff *= 2;
    }
  }
  throw new Error('Max retries reached');
};

const fetchCoinImage = async (coinId: string): Promise<string | null> => {
  try {
    const response = await fetchWithRetry(
      `${COINGECKO_URL}/simple/price?ids=${coinId.toLowerCase()}&include_24hr_change=false`
    );
    if (!response) return null;
    
    const imageUrl = `https://assets.coingecko.com/coins/images/1/small/${coinId.toLowerCase()}.png`;
    return imageUrl;
  } catch (error) {
    console.error('Error fetching coin image:', error);
    return null;
  }
};

export const fetchTopCoins = async (): Promise<Coin[]> => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/assets?limit=2000`);
    if (!response) {
      throw new Error('Failed to fetch coins');
    }
    
    const data = await response.json();
    const validCoins = data.data.filter(validateCoinData);
    console.log(`Fetched ${validCoins.length} valid coins out of ${data.data.length} total coins`);
    
    // Fetch images for each coin with rate limiting
    const coinsWithImages = await Promise.all(
      validCoins.map(async (coin: Coin, index: number) => {
        // Add delay between image requests to avoid rate limiting
        await delay(index * 100);
        const imageUrl = await fetchCoinImage(coin.id);
        return {
          ...coin,
          imageUrl: imageUrl || undefined
        };
      })
    );
    
    if (coinsWithImages.length === 0) {
      toast.error("No valid coin data available");
      return [];
    }
    
    return coinsWithImages;
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
    const currentResponse = await fetchWithRetry(`${BASE_URL}/assets/${coinId}`);
    if (!currentResponse) {
      console.warn(`No current data available for ${coinId}`);
      return [];
    }
    
    const currentData = await currentResponse.json();
    const currentVolume = currentData.data?.volumeUsd24Hr || "0";

    // Then get the historical price data
    const historyResponse = await fetchWithRetry(
      `${BASE_URL}/assets/${coinId}/history?interval=${interval}&start=${start}&end=${end}`
    );
    if (!historyResponse) {
      console.warn(`No historical data available for ${coinId}`);
      return [];
    }
    
    const historyData = await historyResponse.json();

    if (!historyData.data || historyData.data.length === 0) {
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