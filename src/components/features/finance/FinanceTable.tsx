"use client";

import { useEffect, useState, useTransition } from "react";
import { getSupplierBalances, runDeductions } from "@/lib/actions/finance";
import FinanceRow from "./FinanceRow";
import { Button } from "@/components/ui/Button";

export default function FinanceTable() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isPending, startTransition] = useTransition();

  const fetchSuppliers = async () => {
    setLoading(true);
    const data = await getSupplierBalances();
    setSuppliers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [refreshKey]);

  const triggerRefresh = () => setRefreshKey(k => k + 1);

  const handleRunDeductions = () => {
    startTransition(async () => {
      const result = await runDeductions();
      if (result.success) {
        alert(result.message);
        triggerRefresh();
      } else {
        alert("Error running deductions: " + result.message);
      }
    });
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading supplier balances...</div>;
  }

  if (suppliers.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Approved Suppliers</h3>
        <p className="text-gray-500">Approve suppliers from the Suppliers tab to manage their finance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="primary" 
          onClick={handleRunDeductions} 
          disabled={isPending}
        >
          {isPending ? "Running..." : "Run Automated Deductions"}
        </Button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <tr>
                <th className="py-3 px-4 font-semibold">Supplier Name</th>
                <th className="py-3 px-4 font-semibold">Reservation Info</th>
                <th className="py-3 px-4 font-semibold">Current Balance</th>
                <th className="py-3 px-4 font-semibold">Next Deduction</th>
                <th className="py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <FinanceRow
                  key={supplier.id}
                  supplier={supplier}
                  onRefresh={triggerRefresh}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
