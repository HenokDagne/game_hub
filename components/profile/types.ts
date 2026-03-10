export type TransactionItem = {
  id: string;
  dateTime: string;
  method: string;
  withdrawn: string;
  receive: string;
  status: "IN_PROGRESS" | "SUCCESS" | "FAILURE";
};

export type ActivityItem = {
  id: string;
  name: string;
  message: string;
  time: string;
  badge: string;
  imageUrl?: string | null;
};