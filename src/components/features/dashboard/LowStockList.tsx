"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { LowStockProduct } from "@/lib/types";
import { quickReorderProduct } from "@/lib/actions/orders";

export default function LowStockList({
  products,
}: {
  products: LowStockProduct[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [reordering, setReordering] = useState<string | null>(null);
  const widgetProducts = products.slice(0, 3);

  const handleReorder = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Are you sure you want to 1-Click reorder 50 units of this product?")) {
      setReordering(productId);
      const res = await quickReorderProduct(productId);
      if (res.success) {
        alert(res.message);
      } else {
        alert(res.message);
      }
      setReordering(null);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md p-6 rounded-xl w-full md:w-1/3 flex flex-col">
        <div className="flex flex-row justify-between items-center mb-4">
          <h1 className="text-lg">Low Quantity Stock</h1>
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 text-sm hover:underline cursor-pointer"
          >
            See All
          </button>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          {widgetProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex flex-row justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer group"
            >
              <div className="flex flex-row gap-4 items-center">
                <div className="w-12 h-12 relative bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={product.image || "/product.svg"}
                    fill
                    className="object-cover"
                    alt={product.name}
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm line-clamp-1 w-24 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-gray-500 text-xs mt-1">
                    Stock:{" "}
                    <span className="font-medium text-gray-800">
                      {product.remainingStock}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {product.remainingStock === 0 ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-600 font-medium">
                    Out
                  </span>
                ) : (
                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] text-yellow-700 font-medium">
                    Low
                  </span>
                )}
                <button
                  onClick={(e) => handleReorder(e, product.id)}
                  disabled={reordering === product.id}
                  className="text-[10px] font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                >
                  {reordering === product.id ? "..." : "Reorder"}
                </button>
              </div>
            </Link>
          ))}

          {widgetProducts.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-sm">
                Safe stock levels.
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Low Stock Items (< 10)"
        footer={
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        }
      >
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex flex-row justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer group"
            >
              <div className="flex flex-row gap-4 items-center">
                <div className="w-12 h-12 relative bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={product.image || "/product.svg"}
                    fill
                    className="object-cover"
                    alt={product.name}
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Stock:{" "}
                    <span className="text-red-600 font-bold">
                      {product.remainingStock}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleReorder(e, product.id)}
                  disabled={reordering === product.id}
                  className="text-xs font-bold px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  {reordering === product.id ? "Reordering..." : "1-Click Reorder"}
                </button>
                {product.remainingStock === 0 ? (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full w-20 text-center">
                    Out
                  </span>
                ) : (
                  <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full w-20 text-center">
                    Low
                  </span>
                )}
              </div>
            </Link>
          ))}

          {products.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No items are currently low on stock.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}