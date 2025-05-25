// 収支データの型定義
export interface Transaction {
    id: string;
    date: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    description: string;
  }