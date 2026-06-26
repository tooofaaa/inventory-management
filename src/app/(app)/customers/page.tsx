"use client";
import CustomerTable from "@/components/features/customers/CustomerTable";
import { useState, Suspense } from "react";

export default function CustomersPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white shadow-md p-4 rounded-md">
        <div className="flex flex-row justify-between items-center gap-3">
          <h1 className="text-lg pb-2 tracking-wide">Customers</h1>
        </div>
        <div className="pt-2">
          <Suspense fallback={<div className="p-4 text-gray-500">Loading customers...</div>}>
            <CustomerTable
              refreshKey={refreshKey}
              onOrderChange={triggerRefresh}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
