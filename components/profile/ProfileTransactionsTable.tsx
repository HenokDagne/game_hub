import { Check, Circle, Coins, X } from "lucide-react";

type TransactionItem = {
  id: string;
  dateTime: string;
  method: string;
  withdrawn: string;
  receive: string;
  status: "IN_PROGRESS" | "SUCCESS" | "FAILURE";
};

type ProfileTransactionsTableProps = {
  items: TransactionItem[];
};

function statusLabel(status: TransactionItem["status"]) {
  if (status === "SUCCESS") {
    return "Successful";
  }

  if (status === "FAILURE") {
    return "Failure";
  }

  return "In progress";
}

function statusClass(status: TransactionItem["status"]) {
  if (status === "SUCCESS") {
    return "profile-success-text";
  }

  if (status === "FAILURE") {
    return "profile-danger-text";
  }

  return "text-black/70";
}

function StatusIcon({ status }: { status: TransactionItem["status"] }) {
  if (status === "SUCCESS") {
    return <Check size={13} strokeWidth={2.1} />;
  }

  if (status === "FAILURE") {
    return <X size={13} strokeWidth={2.1} />;
  }

  return <Circle size={11} strokeWidth={2} />;
}

export default function ProfileTransactionsTable({ items }: ProfileTransactionsTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border profile-panel">
      <div className="profile-border grid grid-cols-[1.2fr_0.8fr_0.8fr_1fr_0.7fr] gap-3 border-b px-3 py-2 text-[10px] uppercase tracking-[0.16em] profile-muted-text">
        <p>Date & time</p>
        <p>Method</p>
        <p>Withdrawn</p>
        <p>You receive</p>
        <p>Status</p>
      </div>

      <div className="divide-y profile-border">
        {items.map((item) => (
          <article
            className="grid grid-cols-[1.2fr_0.8fr_0.8fr_1fr_0.7fr] items-center gap-3 px-3 py-3 text-xs md:text-sm"
            key={item.id}
          >
            <p className="profile-muted-text">{item.dateTime}</p>
            <p className="profile-strong-text">{item.method}</p>
            <p className="profile-accent-text font-semibold">{item.withdrawn}</p>
            <p className="profile-strong-text inline-flex items-center gap-1.5 font-medium">
              <Coins size={12} strokeWidth={1.9} />
              {item.receive}
            </p>
            <p className={`inline-flex items-center gap-1.5 ${statusClass(item.status)}`}>
              <StatusIcon status={item.status} />
              {statusLabel(item.status)}
            </p>
          </article>
        ))}
      </div>

      <div className="profile-border flex items-center justify-between border-t px-3 py-2">
        <p className="profile-muted-text text-xs">Total transactions</p>
        <p className="profile-strong-text text-xs font-medium">{items.length.toLocaleString()}</p>
      </div>
    </section>
  );
}
