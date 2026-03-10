import ProfileTransactionsTable from "@/components/profile/ProfileTransactionsTable";
import type { TransactionItem } from "@/components/profile/types";

type JackpotPageProps = {
  items: TransactionItem[];
};

export default function JackpotPage({ items }: JackpotPageProps) {
  return <ProfileTransactionsTable items={items.slice(0, 4)} />;
}
