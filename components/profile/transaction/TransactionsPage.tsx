import ProfileTransactionsTable from "@/components/profile/ProfileTransactionsTable";
import type { TransactionItem } from "@/app/dashboard/dummy";

type TransactionsPageProps = {
  items: TransactionItem[];
};

export default function TransactionsPage({ items }: TransactionsPageProps) {
  return <ProfileTransactionsTable items={items} />;
}
