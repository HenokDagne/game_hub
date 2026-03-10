import ProfileTransactionsTable from "@/components/profile/ProfileTransactionsTable";
import type { TransactionItem } from "@/components/profile/types";

type TransactionsPageProps = {
  items: TransactionItem[];
};

export default function TransactionsPage({ items }: TransactionsPageProps) {
  return <ProfileTransactionsTable items={items} />;
}
