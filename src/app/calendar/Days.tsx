"use client"
import { Transaction } from "@prisma/client";
import React, { useState } from "react";
import { CardContent } from "@/components/ui/card";
import CalenderModal from "./CalenderModal";
import { generateCalendarDays } from "@/lib/calender/calender";

const Days = ({
  transactions,
  currentDate,
}: {
  transactions: Transaction[];
  currentDate: Date;
}) => {
  const [selectedDateTransactions, setSelectedDateTransactions] = useState<
    Transaction[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calendarDays = generateCalendarDays(currentDate);

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleDayClick = (day: Date) => {
    const dailyTransactions = transactions.filter(
      (t) => new Date(t.created_at).toISOString().split("T")[0] === formatDate(day)
    );
    setSelectedDateTransactions(dailyTransactions);
    setIsDialogOpen(true); // ダイアログを開く
  };

  return (
    <>
    <CardContent>
      <div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
            <div key={day} className="font-bold">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => {
            const dailyTransactions = day
              ? transactions.filter((t) => new Date(t.created_at).toISOString().split("T")[0] === formatDate(day))
              : [];

            const incomeAmount = dailyTransactions.reduce(
              (sum, t) => (t.type === "INCOME" ? sum + t.amount : sum),
              0
            );
            const expenseAmount = dailyTransactions.reduce(
              (sum, t) => (t.type === "EXPENSE" ? sum + t.amount : sum),
              0
            );

            // 取引がある場合のみ表示
            return (
              <div
                key={index}
                className={`border  pt-0 min-h-[70px] relative ${
                  day ? "cursor-pointer hover:bg-gray-100" : ""
                }`}
                onClick={() => day && handleDayClick(day)}
              >
                {day && (
                  <>
                    <div className="text-[9px] sm:text-xs">{day.getDate()}</div>
                    {/* 収入か支出があれば表示 */}
                    {incomeAmount > 0 && (
                      <div className="text-[9px] sm:text-sm mx-auto font-bold mt-1 text-green-500">
                        {incomeAmount.toLocaleString()}円
                      </div>
                    )}
                    {expenseAmount > 0 && (
                      <div className="text-[9px] sm:text-sm mx-auto font-bold mt-1 text-red-500">
                        {expenseAmount.toLocaleString()}円
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        <CalenderModal
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          selectedDateTransactions={selectedDateTransactions}
        />
      </div>
    </CardContent>
    </>
  );
};

export default Days;