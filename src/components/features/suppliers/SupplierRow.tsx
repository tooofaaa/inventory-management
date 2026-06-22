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
import { EditIcon, DeleteIcon, SaveIcon, CloseIcon } from "@/components/icons";
import { Supplier } from "@/lib/types";

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
  const [isPending, startTransition] = useTransition();

  const [editData, setEditData] = useState({
    supplier_name: supplier.supplier_name,
    address: supplier.address,
    contact_number: formatToLocalPhone(supplier.contact_number),
    purchase_link: supplier.purchase_link,
  });

  const handleCopyPhone = async () => {
    if (isEditing) return;

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

  const handleSave = () => {
    const formData = new FormData();
    formData.append("id", supplier.id);
    formData.append("supplier_name", editData.supplier_name);
    formData.append("address", editData.address);
    formData.append("contact_number", editData.contact_number);
    formData.append("purchase_link", editData.purchase_link);

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

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveSupplier(supplier.id);
      if (result.success) {
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
    <tr className="hover:bg-gray-100">
      <td className="py-2 px-4">
        {isEditing ? (
          <input
            type="text"
            value={editData.supplier_name}
            onChange={(e) =>
              setEditData({ ...editData, supplier_name: e.target.value })
            }
            className="border rounded p-1 w-full"
            disabled={isPending}
          />
        ) : (
          supplier.supplier_name
        )}
      </td>
      <td className="py-2 px-4">
        {isEditing ? (
          <input
            type="text"
            value={editData.address}
            onChange={(e) =>
              setEditData({ ...editData, address: e.target.value })
            }
            className="border rounded p-1 w-full"
            disabled={isPending}
          />
        ) : (
          supplier.address
        )}
      </td>
      <td className="py-2 px-4 cursor-pointer" onClick={handleCopyPhone}>
        {isEditing ? (
          <input
            type="number"
            value={editData.contact_number}
            onChange={(e) =>
              setEditData({ ...editData, contact_number: e.target.value })
            }
            className="border rounded p-1 w-full no-spinner"
            disabled={isPending}
          />
        ) : (
          <span
            className={`cursor-pointer ${
              isCopied ? "text-green-600 font-bold" : ""
            }`}
          >
            {isCopied
              ? "Copied!"
              : formatDisplayPhoneNumber(supplier.contact_number)}
          </span>
        )}
      </td>
      <td className="py-2 px-4">
        {isEditing ? (
          <input
            type="text"
            value={editData.purchase_link}
            onChange={(e) =>
              setEditData({ ...editData, purchase_link: e.target.value })
            }
            className="border rounded p-1 w-full"
            disabled={isPending}
          />
        ) : (
          <Link
            href={formatPurchaseLink(supplier.purchase_link)}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            {supplier.purchase_link}
          </Link>
        )}
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
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={handleSave}
                disabled={isPending}
                className="p-1 text-xs"
              >
                <SaveIcon className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
                className="p-1 text-xs"
              >
                <CloseIcon className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              {supplier.status === "Pending" && (
                <>
                  <button
                    onClick={handleApprove}
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
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
