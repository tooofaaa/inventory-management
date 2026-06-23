"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { getSupplierCatalogProducts, importSupplierProduct } from "@/lib/actions/products";
import Image from "next/image";

export default function ImportProductModal({ onImportComplete }: { onImportComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getSupplierCatalogProducts().then((data) => {
        setCatalog(data);
        setLoading(false);
      });
    }
  }, [isOpen]);

  const handleImport = async (productId: number) => {
    setImportingId(productId);
    const res = await importSupplierProduct(productId);
    if (res.success) {
      alert(res.message);
      setIsOpen(false);
      onImportComplete();
    } else {
      alert(res.message);
    }
    setImportingId(null);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Import from Catalog
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Supplier Product Catalog"
        footer={
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        }
      >
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading catalog...</div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
            {catalog.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No products available to import.</div>
            ) : (
              catalog.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={product.product_image || "/product.svg"} fill className="object-cover" alt={product.product_name} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.product_name}</h3>
                      <p className="text-sm text-gray-500">
                        {product.supplier?.supplier_name} • {product.product_category}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleImport(product.id)}
                    disabled={importingId === product.id}
                  >
                    {importingId === product.id ? "Importing..." : "Import to Inventory"}
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
