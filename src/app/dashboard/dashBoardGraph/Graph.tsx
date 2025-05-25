"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { Transaction, TransactionType } from "@prisma/client";

export function TransactionGraph({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  // データを処理
  const processData = () => {
    // Transaction配列を日付でソート
    const sortedTransactions = [...transactions].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // 現在の日付を取得
    const today = new Date();

    // 期間に基づいてデータをフィルタリング
    let filteredTransactions = sortedTransactions;

    if (period === "week") {
      // 過去7日間のデータを取得
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      filteredTransactions = sortedTransactions.filter(
        (item) => new Date(item.created_at) >= oneWeekAgo
      );
    } else if (period === "month") {
      // 過去30日間のデータを取得
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(today.getDate() - 30);
      filteredTransactions = sortedTransactions.filter(
        (item) => new Date(item.created_at) >= oneMonthAgo
      );
    } else if (period === "year") {
      // 過去365日間のデータを取得
      const oneYearAgo = new Date();
      oneYearAgo.setDate(today.getDate() - 365);
      filteredTransactions = sortedTransactions.filter(
        (item) => new Date(item.created_at) >= oneYearAgo
      );
    }

    // データがなければ空の配列を返す
    if (filteredTransactions.length === 0) {
      return [];
    }

    // 日付ごとにグループ化して金額を集約
    const groupedData: { [key: string]: { income: number; expense: number } } = {};

    filteredTransactions.forEach((item) => {
      const dateKey = new Date(item.created_at).toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      });

      // 同じ日付のデータがすでに存在しない場合は初期化
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = { income: 0, expense: 0 };
      }

      // 収入と支出を分けて集計
      if (item.type === TransactionType.INCOME) {
        groupedData[dateKey].income += item.amount;
      } else {
        groupedData[dateKey].expense += item.amount;
      }
    });

    // グループ化されたデータを配列に変換
    return Object.entries(groupedData).map(([date, amounts]) => ({
      date,
      収入: amounts.income,
      支出: amounts.expense,
      差額: amounts.income - amounts.expense,
    }));
  };

  const chartData = processData();

  return (
    <div className="space-y-4">
      {/* 期間選択タブ */}
      <div className="flex justify-between items-center">
        <h3 className="text-gray-900 font-medium">収支グラフ</h3>
        <Tabs
          value={period}
          onValueChange={(value) => {
            if (value === "week" || value === "month" || value === "year") {
              setPeriod(value);
            }
          }}        >
          <TabsList className="bg-gray-100 border border-gray-200 rounded-full">
            <TabsTrigger
              value="week"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              週
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              月
            </TabsTrigger>
            <TabsTrigger
              value="year"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              年
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* グラフタイプ選択 */}
      <div className="flex justify-end">
        <Tabs
          value={chartType}
          onValueChange={(value) => {
            if (value === "area" || value === "bar") {
              setChartType(value);
            }
          }}        >
          <TabsList className="bg-gray-100 border border-gray-200 rounded-full">
            <TabsTrigger
              value="area"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              エリア
            </TabsTrigger>
            <TabsTrigger
              value="bar"
              className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              棒グラフ
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* グラフ表示エリア */}
      <div className="h-[500px] w-full bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={chartData}>
              <XAxis dataKey="date" tick={{ fill: "#6b7280" }} />
              <YAxis tick={{ fill: "#6b7280" }} />
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  color: "#374151",
                }}
                formatter={(value, name) => [
                  `¥${Number(value).toLocaleString()}`,
                  name
                ]}
              />
              <Area
                type="monotone"
                dataKey="収入"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="支出"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fill: "#6b7280" }} />
              <YAxis tick={{ fill: "#6b7280" }} />
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  color: "#374151",
                }}
                formatter={(value, name) => [
                  `¥${Number(value).toLocaleString()}`,
                  name
                ]}
              />
              <Bar dataKey="収入" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="支出" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* データがない場合のメッセージ */}
      {chartData.length === 0 && (
        <div className="flex justify-center items-center h-20 text-gray-400">
          選択した期間のデータがありません
        </div>
      )}

      {/* 凡例 */}
      <div className="flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm bg-green-500"></div>
          <span className="text-gray-600">収入</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm bg-red-500"></div>
          <span className="text-gray-600">支出</span>
        </div>
      </div>
    </div>
  );
}