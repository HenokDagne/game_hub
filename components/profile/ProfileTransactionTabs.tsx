"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { TransactionItem } from "@/app/dashboard/dummy";
import {
  CoinflipPage,
  JackpotPage,
  PaymentsPage,
  TransactionsPage,
  WithdrawsPage,
} from "@/components/profile/transaction";

type ProfileTransactionTabsProps = {
  items: TransactionItem[];
};

type TabKey = "transactions" | "payments" | "withdraws" | "jackpot" | "coinflip";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "transactions", label: "Transactions" },
  { key: "payments", label: "Payments" },
  { key: "withdraws", label: "Withdraws" },
  { key: "jackpot", label: "Jackpot" },
  { key: "coinflip", label: "Coinflip" },
];

function getActiveTab(value: string | null): TabKey {
  if (value === "payments" || value === "withdraws" || value === "jackpot" || value === "coinflip") {
    return value;
  }

  return "transactions";
}

export default function ProfileTransactionTabs({ items }: ProfileTransactionTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = getActiveTab(searchParams.get("transactionTab"));

  const createHref = (tab: TabKey) => {
    const params = new URLSearchParams(searchParams.toString());

    if (tab === "transactions") {
      params.delete("transactionTab");
    } else {
      params.set("transactionTab", tab);
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const renderTabPage = () => {
    if (activeTab === "payments") {
      return <PaymentsPage items={items} />;
    }

    if (activeTab === "withdraws") {
      return <WithdrawsPage items={items} />;
    }

    if (activeTab === "jackpot") {
      return <JackpotPage items={items} />;
    }

    if (activeTab === "coinflip") {
      return <CoinflipPage items={items} />;
    }

    return <TransactionsPage items={items} />;
  };

  return (
    <div className="space-y-3">
      <div className="profile-border profile-muted-text flex flex-wrap gap-5 border-b pb-2 text-xs">
        {tabs.map((tab) => (
          <Link
            className={
              tab.key === activeTab
                ? "profile-strong-text border-b border-amber-300 pb-1"
                : "transition hover:profile-strong-text"
            }
            href={createHref(tab.key)}
            key={tab.key}
            scroll={false}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="profile-strong-text text-sm font-medium">
          {tabs.find((tab) => tab.key === activeTab)?.label ?? "Transactions"}
        </p>
        <p className="profile-muted-text text-xs">Total transactions: {items.length.toLocaleString()}</p>
      </div>

      {renderTabPage()}
    </div>
  );
}
