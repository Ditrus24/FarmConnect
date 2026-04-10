import { useParams, useLocation, Link } from "wouter";
import { ArrowLeft, MapPin, Star, ShoppingCart, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getProducts, getFarmerById } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = getProducts().find(p => p.id === id);
  const farmer = product ? getFarmerById(product.farmerId) : undefined;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center" data-testid="product-not-found">
        <h2 className="text-2xl font-bold mb-2">Product not found</h2>
        <Link href="/home">
          <Button variant="outline" className="mt-4">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const savings = product.marketPrice - product.price;
  const savingsPct = Math.round((savings / product.marketPrice) * 100);

  const handleAddToCart = () => {
    if (!user) { navigate("/login"); return; }
    if (user.role === "farmer") {
      toast({ title: "Switch account", description: "Only consumers can add to cart.", variant: "destructive" });
      return;
    }
    addToCart(product, quantity);
    toast({ title: "Added to cart", description: `${quantity} × ${product.name} added.` });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" data-testid="img-product-detail" />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="text-xs" variant="secondary">{product.category}</Badge>
              {savings > 0 && (
                <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                  {savingsPct}% below market
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-product-name">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                ))}
                <span className="text-sm text-muted-foreground ml-1">({product.ratingCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-muted/40 rounded-xl p-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary" data-testid="text-product-price">₹{product.price}</span>
              <span className="text-muted-foreground">/{product.unit}</span>
            </div>
            {savings > 0 && (
              <div className="mt-1 space-y-0.5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Market price:</span>
                  <span className="line-through text-muted-foreground">₹{product.marketPrice}/{product.unit}</span>
                </div>
                <p className="text-green-600 font-semibold text-sm" data-testid="text-savings">
                  You save ₹{savings}/{product.unit} by buying direct!
                </p>
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0 text-primary/70" />
              <span data-testid="text-product-location">{product.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="w-4 h-4 shrink-0 text-primary/70" />
              <span data-testid="text-product-quantity">{product.quantity} {product.unit} available</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-1">About this product</h3>
            <p className="text-muted-foreground text-sm leading-relaxed" data-testid="text-product-description">{product.description}</p>
          </div>

          {/* Quantity + Add to Cart */}
          {user?.role !== "farmer" && (
            <div className="flex gap-3 items-center">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  className="px-3 py-2 hover:bg-muted transition-colors text-sm font-medium"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-decrease-quantity"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-medium border-x border-border" data-testid="text-quantity">{quantity}</span>
                <button
                  className="px-3 py-2 hover:bg-muted transition-colors text-sm font-medium"
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  data-testid="button-increase-quantity"
                >
                  +
                </button>
              </div>
              <Button className="flex-1 gap-2" onClick={handleAddToCart} data-testid="button-add-to-cart">
                <ShoppingCart className="w-4 h-4" />
                Add to Cart — ₹{product.price * quantity}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Farmer Profile */}
      {farmer && (
        <div className="mt-10 bg-card rounded-2xl border border-card-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">About the Farmer</h2>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground" data-testid="text-farmer-name">{farmer.name}</h3>
              {farmer.location && (
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{farmer.location}</span>
                </div>
              )}
              {farmer.description && (
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed" data-testid="text-farmer-description">{farmer.description}</p>
              )}
              <Link href={`/farmer-profile/${farmer.id}`}>
                <Button variant="outline" size="sm" className="mt-3" data-testid="button-view-farmer-profile">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
