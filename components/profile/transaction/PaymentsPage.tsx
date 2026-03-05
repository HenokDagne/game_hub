import ProfileTransactionsTable from "@/components/profile/ProfileTransactionsTable";
import type { TransactionItem } from "@/app/dashboard/dummy";

type PaymentsPageProps = {
  items: TransactionItem[];
};

export default function PaymentsPage({ items }: PaymentsPageProps) {
  const filtered = items.filter((item) => item.status === "SUCCESS");
  return <ProfileTransactionsTable items={filtered.length ? filtered : items} />;
}
