import React, { useMemo } from "react";

// Define Blockchain enum to replace direct strings
enum Blockchain {
  Osmosis = "Osmosis",
  Ethereum = "Ethereum",
  Arbitrum = "Arbitrum",
  Zilliqa = "Zilliqa",
  Neo = "Neo",
}

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain; // Use Blockchain enum here
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props; // Assuming `children`, `rest` can pass additional props from `BoxProps`

  const balances: WalletBalance[] = useWalletBalances(); // Assuming this hook is defined elsewhere
  const prices: Record<string, number> = usePrices(); // Assuming this hook is defined elsewhere

  // Using Blockchain enum in getPriority function
  const getPriority = (blockchain: Blockchain): number => {
    const priorities: Record<Blockchain, number> = {
      [Blockchain.Osmosis]: 100,
      [Blockchain.Ethereum]: 50,
      [Blockchain.Arbitrum]: 30,
      [Blockchain.Zilliqa]: 20,
      [Blockchain.Neo]: 20,
    };
    return priorities[blockchain] ?? -99; // Return default priority if blockchain is not found
  };

  // Combine filter, map, and sort in a single iteration using useMemo
  const sortedAndFormattedBalances = useMemo(() => {
    return balances
      .map((balance) => ({
        ...balance,
        priority: getPriority(balance.blockchain), // Attach priority based on blockchain
      }))
      .filter((balance) => balance.priority > -99 && balance.amount > 0) // Filter out invalid balances
      .sort((lhs, rhs) => rhs.priority - lhs.priority) // Sort by priority (descending)
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(), // Format the amount to a string
      }));
  }, [balances]); // Depend on balances only since prices are not used for sorting

  // Render rows directly from sorted and formatted balances
  const rows = sortedAndFormattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row} // Assuming `classes` is defined and imported elsewhere
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;
