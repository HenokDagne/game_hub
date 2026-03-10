import ProfileTransactionsTable from "@/components/profile/ProfileTransactionsTable";
import type { TransactionItem } from "@/components/profile/types";

type CoinflipPageProps = {
  items: TransactionItem[];
};

export default function CoinflipPage({ items }: CoinflipPageProps) {
  const reversed = [...items].reverse();
  return <ProfileTransactionsTable items={reversed} />;
}
