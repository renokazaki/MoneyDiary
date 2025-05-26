import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction } from "@prisma/client";
const CalenderModal = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedDateTransactions,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDateTransactions: Transaction[];
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>取引詳細</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-72">
          {selectedDateTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`p-2 mb-2 rounded ${
                transaction.type === "INCOME"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              } border`}
            >
              <div className="flex justify-between">
                <span>{transaction.category}</span>
                <span
                  className={
                    transaction.type === "INCOME"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  ¥{transaction.amount.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {transaction.note}
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CalenderModal;
