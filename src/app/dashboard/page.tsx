import { auth } from "@clerk/nextjs/server";
import DashboardCard from "./Cards/DashBoardCard"
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TransactionGraph } from "./dashBoardGraph/Graph";
import { Separator } from "@/components/ui/separator";

export default async function DashboardPage() {

const { userId } = await auth();

if (!userId) {
    return redirect("/");
}

const transactions = await prisma.transaction.findMany({
    where: {
        user_clerk_id: userId
    }
})

const balance = transactions.reduce((total, transaction) => {
    if (transaction.type === "INCOME") {
        return total + transaction.amount;
    } else {
        return total - transaction.amount;
    }
}, 0);

  return (
    <div>
    <DashboardCard balance={balance} transactions={transactions}/>
    <Separator/>
    <TransactionGraph transactions={transactions}/>
    </div>
)
}

