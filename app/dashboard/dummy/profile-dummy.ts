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

export function buildDummyTransactions(): TransactionItem[] {
  return [
    {
      id: "t1",
      dateTime: "21.06.2020 - 14:55",
      method: "Steam Wallet",
      withdrawn: "$576",
      receive: "$1,561.14",
      status: "IN_PROGRESS",
    },
    {
      id: "t2",
      dateTime: "20.06.2020 - 10:42",
      method: "Steam Wallet",
      withdrawn: "$428",
      receive: "$1,140.50",
      status: "SUCCESS",
    },
    {
      id: "t3",
      dateTime: "19.06.2020 - 18:05",
      method: "Steam Wallet",
      withdrawn: "$332",
      receive: "$904.12",
      status: "SUCCESS",
    },
    {
      id: "t4",
      dateTime: "18.06.2020 - 08:15",
      method: "Steam Wallet",
      withdrawn: "$510",
      receive: "$1,303.40",
      status: "FAILURE",
    },
  ];
}

export function buildDummyActivity(displayName: string, imageUrl?: string | null): ActivityItem[] {
  return [
    {
      id: "a1",
      name: "Eleanor Pena",
      message: "The unseen of spending three years at Pixelgrade.",
      time: "15:28",
      badge: "79 lvl",
      imageUrl,
    },
    {
      id: "a2",
      name: "Eleanor Pena",
      message: "The unseen of spending three years at Pixelgrade.",
      time: "15:22",
      badge: "100 lvl",
      imageUrl: null,
    },
    {
      id: "a3",
      name: "Eleanor Pena",
      message: "The unseen of spending three years at Pixelgrade.",
      time: "15:15",
      badge: "95 lvl",
      imageUrl: null,
    },
    {
      id: "a4",
      name: "Eleanor Pena",
      message: "The unseen of spending three years at Pixelgrade.",
      time: "15:11",
      badge: "36 lvl",
      imageUrl: null,
    },
    {
      id: "a5",
      name: "Eleanor Pena",
      message: "The unseen of spending three years at Pixelgrade.",
      time: "15:04",
      badge: "21 lvl",
      imageUrl: null,
    },
  ];
}
