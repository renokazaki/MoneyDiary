"use client";

import React, { useState, useEffect } from 'react';
import Days from './Days';
import CalenderHeader from './CalenderHeader';
import { Transaction } from '@prisma/client';

const CalenderPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="h-screen container mx-auto p-4 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen container mx-auto p-4 flex justify-center items-center">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">エラー: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-4 py-16">
      <CalenderHeader 
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <Days 
        transactions={transactions}
        currentDate={currentDate}
      />
    </div>
  );
};

export default CalenderPage;