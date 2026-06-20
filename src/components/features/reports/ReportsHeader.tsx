import DateRangeFilter from "@/components/features/reports/DateRangeFilter";
import { Suspense } from "react";

export default function ReportsHeader() {
  return (
    <div className="bg-white shadow-md p-6 rounded-xl w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Financial Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your financial performance
          </p>
        </div>
        <div className="w-full md:w-auto">
          <Suspense fallback={<div className="h-10 w-48 bg-gray-100 rounded animate-pulse" />}>
            <DateRangeFilter />
          </Suspense>
        </div>
      </div>
    </div>
  );
}