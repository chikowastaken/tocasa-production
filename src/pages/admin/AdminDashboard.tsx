import { Package, ShoppingCart, FolderTree, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Dashboard page is not currently used - empty data
const products: any[] = [];
const categories: any[] = [];
const orders: any[] = [];

const stats = [
  {
    title: "Total Products",
    value: products.length,
    change: "+12%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Categories",
    value: categories.length,
    change: "+2",
    trend: "up",
    icon: FolderTree,
  },
  {
    title: "Total Orders",
    value: orders.length,
    change: "+8%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Revenue",
    value: "₾" + orders.reduce((sum, o) => sum + o.total, 0).toLocaleString(),
    change: "-3%",
    trend: "down",
    icon: TrendingUp,
  },
];

const recentOrders = orders.slice(0, 5);

const AdminDashboard = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-medium">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Welcome back to TOCASA Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="p-3 sm:p-4 md:p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.title}</p>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-0.5 sm:mt-1 truncate">{stat.value}</p>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 sm:mt-3">
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
              ) : (
                <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
              )}
              <span
                className={`text-xs sm:text-sm font-medium ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-4 sm:p-6 border-b border-border">
          <h2 className="font-serif text-base sm:text-lg font-medium">Recent Orders</h2>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-sm font-medium text-muted-foreground p-4">
                  Order ID
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">
                  Customer
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">
                  Date
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">
                  Status
                </th>
                <th className="text-right text-sm font-medium text-muted-foreground p-4">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{order.id}</td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4 text-muted-foreground">{order.date}</td>
                  <td className="p-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-4 text-right font-medium">₾{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden divide-y divide-border">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{order.id}</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{order.customer}</span>
                <span className="font-semibold">₾{order.total}</span>
              </div>
              <p className="text-xs text-muted-foreground">{order.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium capitalize ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
}

export default AdminDashboard;
