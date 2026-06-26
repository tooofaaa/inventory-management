"use client";

import { useEffect, useState } from "react";
import { getSupplierTransactions } from "@/lib/actions/finance";
import { SupplierTransaction } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatters";

interface LedgerModalProps {
  supplierId: number | string;
  supplierName: string;
  onClose: () => void;
}

export default function LedgerModal({ supplierId, supplierName, onClose }: LedgerModalProps) {
  const [transactions, setTransactions] = useState<SupplierTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getSupplierTransactions(supplierId);
      setTransactions(data);
      setLoading(false);
    };
    fetchTransactions();
  }, [supplierId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-w-[90vw] max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Ledger: {supplierName}</h3>
          <Button variant="secondary" onClick={onClose} className="py-1 px-2">Close</Button>
        </div>
        
        <div className="flex-1 overflow-auto">
          {loading ? (
            <p className="text-center text-gray-500 py-4">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No transactions found.</p>
          ) : (
            <table className="min-w-full bg-white text-left text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-4 border-b text-right">Amount</th>
                  <th className="py-2 px-4 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 whitespace-nowrap">
                      {new Date(t.created_at).toLocaleDateString()} {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${t.transaction_type === 'CREDIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {t.transaction_type}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right whitespace-nowrap font-medium">
                      {t.transaction_type === 'CREDIT' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="py-2 px-4 text-gray-600">
                      {t.description || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
