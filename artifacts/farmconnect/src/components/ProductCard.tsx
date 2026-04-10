import { MapPin, Star, ShoppingCart, TrendingDown, CheckCircle2 } from "lucide-react";
import { Product, isNearUser } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  showFarmerName?: boolean;
}

export default function ProductCard({ product, showFarmerName = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const savings = product.marketPrice - product.price;
  const savingsPercent = Math.round((savings / product.marketPrice) * 100);
  const nearUser = isNearUser(product.location, user?.location);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "farmer") {
      toast({ title: "Switch to consumer account", description: "Only consumers can add items to cart.", variant: "destructive" });
      return;
    }
    addToCart(product);
    toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
  };

  return (
    <div
      className="bg-card rounded-2xl border border-card-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      onClick={() => navigate(`/product/${product.id}`)}
      data-testid={`card-product-${product.id}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          data-testid={`img-product-${product.id}`}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges row */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {savings > 0 && (
            <Badge className="bg-primary text-primary-foreground text-[11px] font-bold px-2 py-0.5 shadow-sm" data-testid={`badge-savings-${product.id}`}>
              <TrendingDown className="w-3 h-3 mr-1" />
              {savingsPercent}% off
            </Badge>
          )}
          {nearUser && (
            <Badge className="bg-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 shadow-sm" data-testid={`badge-nearby-${product.id}`}>
              Near You
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + Rating */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400" data-testid={`text-rating-${product.id}`}>{product.rating}</span>
          </div>
        </div>

        {/* Farmer Story */}
        {showFarmerName && (
          <div className="mb-2">
            <p className="text-xs font-medium text-foreground/80" data-testid={`text-farmer-${product.id}`}>{product.farmerName}</p>
            {product.farmerDescription && (
              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5" data-testid={`text-farmer-desc-${product.id}`}>
                {product.farmerDescription}
              </p>
            )}
          </div>
        )}

        {/* Trust Bar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="text-[11px] truncate max-w-[100px]" data-testid={`text-location-${product.id}`}>{product.location.split(",")[0]}</span>
          </div>
          {product.ordersCompleted > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground ml-auto shrink-0">
              <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
              <span className="text-[11px]" data-testid={`text-orders-${product.id}`}>{product.ordersCompleted} sold</span>
            </div>
          )}
        </div>

        {/* Price Row */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
                ₹{product.price}
              </span>
              <span className="text-xs text-muted-foreground">/{product.unit}</span>
            </div>
            {savings > 0 && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-muted-foreground line-through">₹{product.marketPrice}</span>
                <span className="text-xs text-green-600 font-semibold">Save ₹{savings}</span>
              </div>
            )}
          </div>
          {user?.role !== "farmer" && (
            <Button
              size="sm"
              className="shrink-0 gap-1 h-8 text-xs px-3 shadow-sm rounded-xl"
              onClick={handleAddToCart}
              data-testid={`button-add-cart-${product.id}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
