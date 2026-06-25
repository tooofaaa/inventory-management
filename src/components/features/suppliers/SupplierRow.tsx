"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateSupplier, deleteSupplier, approveSupplier, declineSupplier } from "@/lib/actions/suppliers";
import {
  formatDisplayPhoneNumber,
  formatPurchaseLink,
  formatToLocalPhone,
} from "@/lib/utils/formatters";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { Button } from "@/components/ui/Button";
import { EditIcon, DeleteIcon, CloseIcon } from "@/components/icons";
import { Supplier } from "@/lib/types";
import { createPortal } from "react-dom";

interface SupplierRowProps {
  supplier: Supplier;
  onOrderChange: () => void;
}

export default function SupplierRow({
  supplier,
  onOrderChange,
}: SupplierRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveData, setApproveData] = useState({
    space: "",
    cost: "",
    period: "Monthly",
  });
  const [isPending, startTransition] = useTransition();

  const [editData, setEditData] = useState({
    supplier_name: supplier.supplier_name || "",
    address: supplier.address || "",
    contact_number: supplier.contact_number ? formatToLocalPhone(supplier.contact_number) : "",
    purchase_link: supplier.purchase_link || "",
    reserved_space_m3: supplier.reserved_space_m3?.toString() || "",
    next_deduction_date: supplier.next_deduction_date ? supplier.next_deduction_date.substring(0, 10) : "",
    reservation_start_date: supplier.reservation_start_date ? supplier.reservation_start_date.substring(0, 10) : "",
    reservation_end_date: supplier.reservation_end_date ? supplier.reservation_end_date.substring(0, 10) : "",
  });

  const handleCopyPhone = async () => {
    const localPhone = formatToLocalPhone(supplier.contact_number);
    const success = await copyToClipboard(localPhone);

    if (success) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } else {
      alert("Failed to copy phone number.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", supplier.id);
    formData.append("supplier_name", editData.supplier_name);
    formData.append("address", editData.address);
    formData.append("contact_number", editData.contact_number);
    formData.append("purchase_link", editData.purchase_link);

    formData.append("reserved_space_m3", editData.reserved_space_m3);
    formData.append("next_deduction_date", editData.next_deduction_date);
    formData.append("reservation_start_date", editData.reservation_start_date);
    formData.append("reservation_end_date", editData.reservation_end_date);

    startTransition(async () => {
      const result = await updateSupplier(null, formData);
      if (result.success) {
        setIsEditing(false);
        alert("Supplier updated!");
        onOrderChange();
      } else {
        alert(result.message);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure? This will delete the supplier.")) return;

    startTransition(async () => {
      const result = await deleteSupplier(supplier.id);
      if (result.success) {
        alert("Supplier deleted!");
        onOrderChange();
      } else {
        alert(result.message);
      }
    });
  };

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    const space = parseFloat(approveData.space);
    const cost = parseFloat(approveData.cost);
    
    if (isNaN(space) || isNaN(cost) || space < 0 || cost < 0) {
      alert("Please enter valid positive numbers for space and cost.");
      return;
    }

    startTransition(async () => {
      const result = await approveSupplier(supplier.id, space, cost, approveData.period);
      if (result.success) {
        setIsApproveModalOpen(false);
        alert("Supplier approved!");
        onOrderChange();
      } else {
        alert(result.message);
      }
    });
  };

  const handleDecline = () => {
    if (!confirm("Are you sure you want to decline this supplier?")) return;

    startTransition(async () => {
      const result = await declineSupplier(supplier.id);
      if (result.success) {
        alert("Supplier declined!");
        onOrderChange();
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <>
      {isApproveModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-lg font-bold mb-4">Approve Supplier</h3>
            <form onSubmit={handleApprove}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reserved Space (m³)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={approveData.space}
                  onChange={(e) => setApproveData({ ...approveData, space: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Cost</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={approveData.cost}
                  onChange={(e) => setApproveData({ ...approveData, cost: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Period</label>
                <select
                  value={approveData.period}
                  onChange={(e) => setApproveData({ ...approveData, period: e.target.value })}
                  className="w-full border rounded p-2"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsApproveModalOpen(false)} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isPending}>
                  Approve
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {isEditing && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg w-[500px] max-w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Supplier</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-black">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                <input
                  type="text"
                  required
                  value={editData.supplier_name}
                  onChange={(e) => setEditData({ ...editData, supplier_name: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="number"
                  required
                  value={editData.contact_number}
                  onChange={(e) => setEditData({ ...editData, contact_number: e.target.value })}
                  className="w-full border rounded p-2 no-spinner"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Link</label>
                <input
                  type="text"
                  required
                  value={editData.purchase_link}
                  onChange={(e) => setEditData({ ...editData, purchase_link: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Reservation Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reserved Space (m³)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editData.reserved_space_m3}
                      onChange={(e) => setEditData({ ...editData, reserved_space_m3: e.target.value })}
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Deduction</label>
                    <input
                      type="date"
                      value={editData.next_deduction_date}
                      onChange={(e) => setEditData({ ...editData, next_deduction_date: e.target.value })}
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={editData.reservation_start_date}
                      onChange={(e) => setEditData({ ...editData, reservation_start_date: e.target.value })}
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={editData.reservation_end_date}
                      onChange={(e) => setEditData({ ...editData, reservation_end_date: e.target.value })}
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <tr className="hover:bg-gray-100">
        <td className="py-2 px-4">{supplier.supplier_name}</td>
        <td className="py-2 px-4">{supplier.address}</td>
        <td className="py-2 px-4 cursor-pointer" onClick={handleCopyPhone}>
          <span className={`cursor-pointer ${isCopied ? "text-green-600 font-bold" : ""}`}>
            {isCopied ? "Copied!" : formatDisplayPhoneNumber(supplier.contact_number)}
          </span>
        </td>
        <td className="py-2 px-4">
          <Link href={formatPurchaseLink(supplier.purchase_link)} target="_blank" className="text-blue-600 hover:underline">
            {supplier.purchase_link}
          </Link>
        </td>
        <td className="py-2 px-4">
          {(() => {
            const status = supplier.status || "Approved";
            let badgeClass = "bg-gray-50 text-gray-700 border-gray-200";
            if (status === "Approved") badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
            if (status === "Pending") badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
            if (status === "Declined") badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
            return (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}>
                {status}
              </span>
            );
          })()}
        </td>
        <td className="py-2 px-4">
          <div className="flex gap-2">
            {supplier.status === "Pending" && (
              <>
                <button
                  onClick={() => setIsApproveModalOpen(true)}
                  disabled={isPending}
                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={handleDecline}
                  disabled={isPending}
                  className="px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors"
                >
                  Decline
                </button>
              </>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
              className="p-1 text-xs"
            >
              <EditIcon className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleDelete}
              disabled={isPending}
              className="p-1 text-xs text-red-500"
            >
              <DeleteIcon className="w-4 h-4" />
            </Button>
          </div>
        </td>
      </tr>
    </>
  );
}
