import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction, TransactionType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import TransactionForm from "./TransactionForm";
import { Trash2 } from "lucide-react";

interface CalenderModalProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDateTransactions: Transaction[];
  selectedDate: Date | null;
}

const CalenderModal = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedDateTransactions,
  selectedDate,
}: CalenderModalProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const formatDate = (date: Date | null) => {
    if (!date) return "取引詳細";
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        window.location.reload(); // 削除後にページをリロード
      }
    } catch (error) {
      console.error("削除に失敗しました", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{formatDate(selectedDate)}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          {/* 既存の取引一覧 */}
          <div className="space-y-2 mb-4">
            {selectedDateTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-3 rounded-lg border ${
                  transaction.type === "INCOME"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {transaction.category || "未分類"}
                  </span>
                  <span
                    className={`font-bold ${
                      transaction.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}¥
                    {transaction.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                <div>
                {transaction.note && (
                  <div className="text-sm text-gray-500 mt-1">
                    {transaction.note}
                  </div>
                )}
                </div>
                <div className="flex justify-end items-center">
                <Button
                  onClick={() => {
                    handleDeleteTransaction(transaction.id);
                  }}
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                </div>
                </div>
              </div>
            ))}
          </div>
          <TransactionForm
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            selectedDate={selectedDate}
            type={type}
            setType={setType}
            amount={amount}
            setAmount={setAmount}
            category={category}
            setCategory={setCategory}
            note={note}
            setNote={setNote}
          />

          {/* 新規登録ボタン */}
          {!showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-black text-white cursor-pointer"
            >
              新規登録
            </Button>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CalenderModal;
