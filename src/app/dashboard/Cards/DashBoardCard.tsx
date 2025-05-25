
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import Cards from "./Cards";
import { Transaction } from "@prisma/client";

type DashboardProps = {
  transactions: Transaction[];
  balance: number;
};

const DashboardCard: React.FC<DashboardProps> = ({ transactions, balance }) => {
  // 現在の月の取引データをフィルタリング
  const getCurrentMonthTransactions = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return transactions.filter((t) => {
      const transactionDate = new Date(t.created_at);
      return transactionDate >= firstDay && transactionDate <= lastDay;
    });
  };

  const currentMonthTransactions = getCurrentMonthTransactions();


  // 今月の収入
  const income = currentMonthTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  // 今月の支出
  const expense = currentMonthTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex justify-center item-center pt-8 md:pb-8 pb-20 gap-4 sm:gap-16 ">
      <Cards
        title="現在の残高"
        amount={balance}
        icon={<Wallet className="w-6 h-6 text-muted-foreground" />}
        color="muted"
      />
      <Cards
        title="今月の収入"
        amount={income}
        icon={<TrendingUp className="w-6 h-6 text-green-500" />}
        color="green"
      />
      <Cards
        title="今月の支出"
        amount={expense}
        icon={<TrendingDown className="w-6 h-6 text-red-500" />}
        color="red"
      />
    </div>
  );
};

export default DashboardCard;
