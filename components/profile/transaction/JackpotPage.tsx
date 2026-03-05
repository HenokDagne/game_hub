import ProfileTransactionsTable from "@/components/profile/ProfileTransactionsTable";
import type { TransactionItem } from "@/app/dashboard/dummy";

type JackpotPageProps = {
  items: TransactionItem[];
};

export default function JackpotPage({ items }: JackpotPageProps) {
  return <ProfileTransactionsTable items={items.slice(0, 4)} />;
}
