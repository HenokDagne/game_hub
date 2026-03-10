import ProfileTransactionsTable from "@/components/profile/ProfileTransactionsTable";
import type { TransactionItem } from "@/components/profile/types";

type WithdrawsPageProps = {
  items: TransactionItem[];
};

export default function WithdrawsPage({ items }: WithdrawsPageProps) {
  const filtered = items.filter((item) => item.status !== "SUCCESS");
  return <ProfileTransactionsTable items={filtered.length ? filtered : items} />;
}
