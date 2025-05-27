import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request, 
    context: { params: Promise<{ id: string }> }  // ←ここを修正
  ) {
    const { userId } = await auth();
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const { id } = await context.params;  // ←awaitを追加
      await prisma.transaction.delete({
        where: {
          id,
          user_clerk_id: userId,
        },
      });
      return NextResponse.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }