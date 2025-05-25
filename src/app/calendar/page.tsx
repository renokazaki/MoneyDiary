import React from 'react'
import Days from './Days'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CalenderHeader from './CalenderHeader';

const CalenderPage = async () => {

const { userId } = await auth();

if (!userId) {
    return redirect("/");
}

const transactions = await prisma.transaction.findMany({
    where: {
        user_clerk_id: userId
    }
})

  return (
    <div>
      <CalenderHeader />
      <Days transactions={transactions}/>
    </div>
  )
}

export default CalenderPage