"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatters";
import { addSupplierCredit } from "@/lib/actions/finance";
import LedgerModal from "./LedgerModal";
import { Supplier } from "@/lib/types";

interface FinanceRowProps {
  supplier: Supplier;
  onRefresh: () => void;
}

export default function FinanceRow({ supplier, onRefresh }: FinanceRowProps) {
  const [isAddCreditOpen, setIsAddCreditOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddCredit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    startTransition(async () => {
      const res = await addSupplierCredit(supplier.id, amount, description || "Admin added credit");
      if (res.success) {
        setIsAddCreditOpen(false);
        setCreditAmount("");
        setDescription("");
        alert("Credit added successfully!");
        onRefresh();
      } else {
        alert(res.message);
      }
    });
  };

  const balance = supplier.balance ?? 0;
  const reservationCost = supplier.reservation_cost ?? 0;
  const reservedSpace = supplier.reserved_space_m3 ?? 0;

  return (
    <>
      <tr className="hover:bg-gray-100 border-b">
        <td className="py-3 px-4 font-medium text-gray-900">{supplier.supplier_name}</td>
        <td className="py-3 px-4 text-gray-600">
          <div>{reservedSpace} m³</div>
          <div className="text-xs font-medium text-gray-800">{formatCurrency(reservationCost)} / {supplier.reservation_period || "Monthly"}</div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="font-medium text-gray-700">Dates:</span>{' '}
            {supplier.reservation_start_date ? new Date(supplier.reservation_start_date).toLocaleDateString() : 'Unset'} 
            {' - '}
            {supplier.reservation_end_date ? new Date(supplier.reservation_end_date).toLocaleDateString() : 'Unset'}
          </div>
        </td>
        <td className="py-3 px-4">
          <span className={`font-semibold ${balance < 0 ? 'text-red-600' : balance < reservationCost ? 'text-orange-500' : 'text-green-600'}`}>
            {formatCurrency(balance)}
          </span>
          {supplier.has_insufficient_funds && (
            <div className="text-xs text-red-500 font-medium mt-1">Payment Overdue</div>
          )}
        </td>
        <td className="py-3 px-4 text-gray-500 text-sm">
          {supplier.next_deduction_date 
            ? new Date(supplier.next_deduction_date).toLocaleDateString()
            : '-'}
        </td>
        <td className="py-3 px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddCreditOpen(true)}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Add Credit
            </button>
            <button
              onClick={() => setIsLedgerOpen(true)}
              className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer transition-colors border border-gray-300"
            >
              Ledger
            </button>
          </div>

          {isAddCreditOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-left cursor-default">
              <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
                <h3 className="text-lg font-bold mb-4">Add Credit: {supplier.supplier_name}</h3>
                <form onSubmit={handleAddCredit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      className="w-full border rounded p-2"
                      placeholder="e.g. 500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border rounded p-2"
                      placeholder="e.g. Bank transfer"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={() => setIsAddCreditOpen(false)} disabled={isPending}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isPending}>
                      Add Credit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isLedgerOpen && (
            <LedgerModal
              supplierId={supplier.id}
              supplierName={supplier.supplier_name}
              onClose={() => setIsLedgerOpen(false)}
            />
          )}
        </td>
      </tr>
    </>
  );
}
