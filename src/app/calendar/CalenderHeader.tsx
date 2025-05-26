"use client"

import React from "react";
import { CardTitle, CardHeader } from "@/components/ui/card";

const CalenderHeader = ({
  currentDate,
  setCurrentDate,
}: {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
            )
          }
          className="p-2 bg-gray-100 rounded  text-black"
        >
          {"<"}
        </button>
        <CardTitle>
          {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        </CardTitle>
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            )
          }
          className="p-2  bg-gray-100 rounded  text-black"
        >
          {">"}
        </button>
      </div>
    </CardHeader>
  );
};

export default CalenderHeader;
