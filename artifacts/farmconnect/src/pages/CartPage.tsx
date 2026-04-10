import { useLocation, Link } from "wouter";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { placeOrder } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalSaved, totalItems } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    const order = placeOrder(user.id, items);
    clearCart();
    toast({ title: "Order placed!", description: `Order #${order.id.slice(0, 8)} confirmed. Total: ₹${order.totalPrice}` });
    navigate("/orders");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center" data-testid="empty-cart">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-9 h-9 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Start adding fresh produce from local farmers</p>
        <Link href="/home">
          <Button className="gap-2" data-testid="button-shop-now">
            Browse Marketplace
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-cart-heading">Your Cart</h1>
          <p className="text-sm text-muted-foreground">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={clearCart} data-testid="button-clear-cart">
          <Trash2 className="w-4 h-4 mr-1" />
          Clear all
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.product.id} className="bg-card rounded-xl border border-card-border p-4 flex gap-4" data-testid={`cart-item-${item.product.id}`}>
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
                data-testid={`img-cart-${item.product.id}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm" data-testid={`text-cart-name-${item.product.id}`}>{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.product.farmerName} · {item.product.location}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors mt-0.5 shrink-0"
                    data-testid={`button-remove-${item.product.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                    <button
                      className="px-2.5 py-1.5 hover:bg-muted transition-colors text-sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      data-testid={`button-decrease-${item.product.id}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium border-x border-border" data-testid={`text-qty-${item.product.id}`}>{item.quantity}</span>
                    <button
                      className="px-2.5 py-1.5 hover:bg-muted transition-colors text-sm"
                      onClick={() => updateQuantity(item.product.id, Math.min(item.product.quantity, item.quantity + 1))}
                      data-testid={`button-increase-${item.product.id}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground" data-testid={`text-item-total-${item.product.id}`}>
                      ₹{item.product.price * item.quantity}
                    </div>
                    <div className="text-xs text-muted-foreground">₹{item.product.price}/{item.product.unit}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-card-border p-5 sticky top-20">
            <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium" data-testid="text-subtotal">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary" data-testid="text-total">₹{totalPrice}</span>
              </div>
            </div>

            {totalSaved > 0 && (
              <div className="mt-4 bg-green-50 dark:bg-green-950/30 rounded-lg p-3 flex items-start gap-2 border border-green-200 dark:border-green-900">
                <TrendingDown className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-700 dark:text-green-400">You are saving!</p>
                  <p className="text-sm font-bold text-green-600" data-testid="text-savings-amount">₹{totalSaved} vs market price</p>
                </div>
              </div>
            )}

            <Button className="w-full mt-5 gap-2" onClick={handlePlaceOrder} data-testid="button-place-order">
              Place Order
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link href="/home">
              <Button variant="ghost" className="w-full mt-2 text-sm" data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
