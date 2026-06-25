import { Suspense } from "react";
import FinanceTable from "@/components/features/finance/FinanceTable";

export default function FinancePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Supplier Finance</h1>
        <p className="text-sm text-gray-600 mb-6">
          Manage supplier credits, view ledgers, and track warehouse reservation costs.
        </p>

        <Suspense fallback={<div className="p-4 text-gray-500">Loading finance data...</div>}>
          <FinanceTable />
        </Suspense>
      </div>
    </div>
  );
}
