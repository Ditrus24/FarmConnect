import { MapPin, Star, ShoppingCart, TrendingDown } from "lucide-react";
import { Product } from "@/lib/types";
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
      className="bg-card rounded-xl border border-card-border overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
      onClick={() => navigate(`/product/${product.id}`)}
      data-testid={`card-product-${product.id}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`img-product-${product.id}`}
        />
        {savings > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold" data-testid={`badge-savings-${product.id}`}>
            <TrendingDown className="w-3 h-3 mr-1" />
            {savingsPercent}% off
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-1" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-muted-foreground" data-testid={`text-rating-${product.id}`}>{product.rating}</span>
          </div>
        </div>

        {showFarmerName && (
          <p className="text-xs text-muted-foreground mb-1" data-testid={`text-farmer-${product.id}`}>{product.farmerName}</p>
        )}

        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate" data-testid={`text-location-${product.id}`}>{product.location}</span>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-primary" data-testid={`text-price-${product.id}`}>
                ₹{product.price}
              </span>
              <span className="text-xs text-muted-foreground">/{product.unit}</span>
            </div>
            {savings > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground line-through">₹{product.marketPrice}</span>
                <span className="text-xs text-green-600 font-medium">Save ₹{savings}</span>
              </div>
            )}
          </div>
          {user?.role !== "farmer" && (
            <Button
              size="sm"
              className="shrink-0 gap-1 h-8 text-xs"
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
