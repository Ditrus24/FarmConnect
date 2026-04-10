import { useLocation, Link } from "wouter";
import { Package, Calendar, TrendingDown, ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersByUser } from "@/lib/store";

export default function OrdersPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (!user) {
    navigate("/login");
    return null;
  }

  const orders = getOrdersByUser(user.id).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center" data-testid="empty-orders">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Package className="w-9 h-9 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-6">Your order history will appear here</p>
        <Link href="/home">
          <Button className="gap-2" data-testid="button-start-shopping">
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6" data-testid="text-orders-heading">My Orders</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-card rounded-xl border border-card-border overflow-hidden" data-testid={`order-card-${order.id}`}>
            {/* Order Header */}
            <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground" data-testid={`text-order-id-${order.id}`}>
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={order.status === "Delivered" ? "default" : "secondary"}
                  className={order.status === "Delivered" ? "bg-green-100 text-green-700 border-green-200" : ""}
                  data-testid={`badge-status-${order.id}`}
                >
                  {order.status}
                </Badge>
                <span className="font-bold text-primary" data-testid={`text-order-total-${order.id}`}>₹{order.totalPrice}</span>
              </div>
            </div>

            {/* Items */}
            <div className="px-5 py-3 space-y-3">
              {order.items.map(item => (
                <div key={item.product.id} className="flex items-center gap-3" data-testid={`order-item-${item.product.id}`}>
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {item.product.location}
                    </div>
                  </div>
                  <div className="text-right text-sm shrink-0">
                    <div className="font-medium text-foreground">₹{item.product.price * item.quantity}</div>
                    <div className="text-muted-foreground text-xs">{item.quantity} × ₹{item.product.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Savings Footer */}
            {order.savedAmount > 0 && (
              <div className="px-5 py-3 bg-green-50 dark:bg-green-950/20 border-t border-border flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-600 shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-400">
                  You saved <span className="font-bold">₹{order.savedAmount}</span> by buying directly from farmers!
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
