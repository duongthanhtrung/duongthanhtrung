import useSWR from "swr";

export interface Price {
  currency: string;
  date: string;
  price: number;
}

const fetcher = async (url: string): Promise<Price[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

// Function to process and deduplicate data
const processPrices = (prices: Price[]): Price[] => {
  const uniquePrices = Object.values(
    prices.reduce((acc, item) => {
      const key = item.currency;

      if (
        !acc[key] ||
        new Date(acc[key].date) < new Date(item.date) ||
        (new Date(acc[key].date).getTime() === new Date(item.date).getTime() &&
          acc[key].price < item.price)
      ) {
        acc[key] = item;
      }

      return acc;
    }, {} as Record<string, Price>)
  );

  return uniquePrices;
};

export function usePrices() {
  const { data, error, isLoading, mutate } = useSWR<Price[]>(
    "https://interview.switcheo.com/prices.json",
    fetcher
  );
  const processedData = data ? processPrices(data) : [];

  return {
    data: processedData,
    error,
    isLoading,
    refresh: mutate,
  };
}
