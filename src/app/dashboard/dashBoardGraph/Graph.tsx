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

    // 支出のみをフィルタリング
    const expenseTransactions = filteredTransactions.filter(
      (item) => item.type === TransactionType.EXPENSE
    );

    // データがなければ空の配列を返す
    if (expenseTransactions.length === 0) {
      return [];
    }

    // 日付ごとにカテゴリ別で集約
    const groupedData: { [key: string]: { [category: string]: number } } = {};

    expenseTransactions.forEach((item) => {
      const dateKey = new Date(item.created_at).toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      });
      const category = item.category || "その他";

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {};
      }

      if (!groupedData[dateKey][category]) {
        groupedData[dateKey][category] = 0;
      }

      groupedData[dateKey][category] += item.amount;
    });

    // すべてのカテゴリを取得
    const allCategories = Array.from(
      new Set(
        expenseTransactions.map((item) => item.category || "その他")
      )
    );

    // グループ化されたデータを配列に変換
    return Object.entries(groupedData).map(([date, categories]) => {
      const result: { date: number; [category: string]: number } = { date: Number(date) };
      allCategories.forEach((category) => {
        result[category] = categories[category] || 0;
      });
      return result;
    });
  };

  const chartData = processData();
  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

  return (
    <div className="space-y-4">
      {/* 期間選択タブ */}
      <div className="flex justify-between items-center">
        <h3 className="text-gray-900 font-medium">カテゴリ別支出グラフ</h3>
        <Tabs
          value={period}
          onValueChange={(value) => {
            if (value === "week" || value === "month" || value === "year") {
              setPeriod(value);
            }
          }}
        >
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
          }}
        >
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
              {chartData.length > 0 && 
                Object.keys(chartData[0])
                  .filter(key => key !== 'date')
                  .map((category, index) => (
                    <Area
                      key={category}
                      type="monotone"
                      dataKey={category}
                      stroke={colors[index % colors.length]}
                      fill={colors[index % colors.length]}
                      fillOpacity={0.3}
                    />
                  ))
              }
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
              {chartData.length > 0 && 
                Object.keys(chartData[0])
                  .filter(key => key !== 'date')
                  .map((category, index) => (
                    <Bar 
                      key={category}
                      dataKey={category} 
                      fill={colors[index % colors.length]} 
                      radius={[4, 4, 0, 0]} 
                    />
                  ))
              }
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* データがない場合のメッセージ */}
      {chartData.length === 0 && (
        <div className="flex justify-center items-center h-20 text-gray-400">
          選択した期間の支出データがありません
        </div>
      )}

      {/* 凡例 */}
      <div className="flex items-center justify-center flex-wrap gap-4 text-sm">
        {chartData.length > 0 && 
          Object.keys(chartData[0])
            .filter(key => key !== 'date')
            .map((category, index) => (
              <div key={category} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-gray-600">{category}</span>
              </div>
            ))
        }
      </div>
    </div>
  );
}