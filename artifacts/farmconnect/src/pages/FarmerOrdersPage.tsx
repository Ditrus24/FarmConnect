import { useLocation, Link } from "wouter";
import { Package, Calendar, TrendingUp, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersByFarmer, updateOrderStatus } from "@/lib/store";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function FarmerOrdersPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [refresh, setRefresh] = useState(0);

  if (!user || user.role !== "farmer") {
    navigate("/login");
    return null;
  }

  const orders = getOrdersByFarmer(user.id).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const farmerItems = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    return order?.items.filter(i => i.product.farmerId === user.id) || [];
  };

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, "Delivered");
    toast({ title: "Order delivered", description: "Order has been marked as delivered." });
    setRefresh(r => r + 1);
  };

  const freshOrders = getOrdersByFarmer(user.id).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalRevenue = freshOrders.reduce((sum, order) => {
    const myItems = order.items.filter(i => i.product.farmerId === user.id);
    return sum + myItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  }, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/farmer-dashboard">
          <Button variant="ghost" size="icon" data-testid="button-back-dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-farmer-orders-heading">Customer Orders</h1>
          <p className="text-sm text-muted-foreground">{freshOrders.length} total orders</p>
        </div>
      </div>

      {/* Revenue Summary */}
      {freshOrders.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
            <div className="text-2xl font-bold text-primary" data-testid="text-total-revenue">₹{totalRevenue}</div>
          </div>
        </div>
      )}

      {freshOrders.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border" data-testid="empty-farmer-orders">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
          <p className="text-muted-foreground text-sm">Orders from consumers will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {freshOrders.map(order => {
            const myItems = order.items.filter(i => i.product.farmerId === user.id);
            const myTotal = myItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
            return (
              <div key={order.id} className="bg-card rounded-xl border border-card-border overflow-hidden" data-testid={`farmer-order-${order.id}`}>
                <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-border">
                  <div>
                    <p className="text-sm font-medium" data-testid={`text-farmer-order-id-${order.id}`}>
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={order.status === "Delivered" ? "default" : "secondary"}
                      className={order.status === "Delivered" ? "bg-green-100 text-green-700 border-green-200" : ""}
                      data-testid={`badge-order-status-${order.id}`}
                    >
                      {order.status}
                    </Badge>
                    <span className="font-bold text-primary">₹{myTotal}</span>
                  </div>
                </div>

                <div className="px-5 py-3 space-y-2">
                  {myItems.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3" data-testid={`farmer-order-item-${item.product.id}`}>
                      <img src={item.product.image} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} {item.product.unit}</p>
                      </div>
                      <span className="text-sm font-medium text-foreground">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {order.status === "Pending" && (
                  <div className="px-5 py-3 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleMarkDelivered(order.id)}
                      data-testid={`button-mark-delivered-${order.id}`}
                    >
                      Mark as Delivered
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
