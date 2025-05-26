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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalenderModalProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDateTransactions: Transaction[];
  selectedDate: Date | null;
  onTransactionChange: () => void;
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
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setNote("");
    setType(TransactionType.EXPENSE);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedDate) return;

    setLoading(true);
    try {
      // 日付のタイムゾーンずれを防ぐために、現地時間で日付を作成
      const localDate = new Date(selectedDate);
      localDate.setHours(12, 0, 0, 0); // 正午に設定してタイムゾーンずれを防ぐ
      
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          category,
          note,
          created_at: localDate.toISOString(),
        }),
      });

      if (response.ok) {
        resetForm();
        window.location.reload(); // ページ全体をリロード
    }
    } catch (error) {
      console.error("保存に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    // タイムゾーンずれを防ぐために、現地時間で日付文字列を作成
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "取引詳細";
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                {transaction.note && (
                  <div className="text-sm text-gray-500 mt-1">
                    {transaction.note}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 新規追加フォーム */}
          {showAddForm && (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg mb-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Label>日付</Label>
                  <Input
                    type="date"
                    value={formatDateForInput(selectedDate)}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>種類</Label>
                    <Select
                      value={type}
                      onValueChange={(value) => setType(value as TransactionType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TransactionType.INCOME}>収入</SelectItem>
                        <SelectItem value={TransactionType.EXPENSE}>支出</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>金額</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label>カテゴリ</Label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="食費、交通費など"
                  />
                </div>
                
                <div>
                  <Label>メモ</Label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="詳細情報"
                    rows={2}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "保存中..." : "追加"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* 新規登録ボタン */}
          {!showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full"
              variant="outline"
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