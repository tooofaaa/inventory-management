import SaleClientWrapper from "@/components/features/sales/SaleClientWrapper";
import OverallSales from "@/components/features/sales/OverallSales";
import { Supplier } from "@/lib/types";
import { getAllProductsForSelect } from "@/lib/actions/products";
import { getAllCustomers } from "@/lib/actions/customers";
import { getOverallSalesStats } from "@/lib/actions/sales";
import { getAllSuppliers } from "@/lib/actions/suppliers";

export default async function SalesPage() {
  const [products, customers, stats, suppliers] = await Promise.all([
    getAllProductsForSelect(),
    getAllCustomers(),
    getOverallSalesStats(),
    getAllSuppliers(),
  ]);

  const salesStats = stats || {
    total_revenue: 0,
    total_profit: 0,
    total_transactions: 0,
    today_revenue: 0,
  };

  return (
    <div className="flex flex-col gap-3 mx-3 md:mx-0 md:mr-3">
      <OverallSales
        totalRevenue={salesStats.total_revenue}
        totalProfit={salesStats.total_profit}
        totalTransactions={salesStats.total_transactions}
        todayRevenue={salesStats.today_revenue}
      />
      <SaleClientWrapper products={products} customers={customers} suppliers={suppliers as unknown as Supplier[]} />
    </div>
  );
}
