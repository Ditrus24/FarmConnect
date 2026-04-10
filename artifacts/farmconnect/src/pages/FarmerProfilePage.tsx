import { useParams, useLocation, Link } from "wouter";
import { MapPin, Star, User, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFarmerById, getProductsByFarmer } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

export default function FarmerProfilePage() {
  const { id } = useParams();
  const [, navigate] = useLocation();

  const farmer = id ? getFarmerById(id) : undefined;
  const products = id ? getProductsByFarmer(id) : [];

  if (!farmer) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center" data-testid="farmer-not-found">
        <h2 className="text-2xl font-bold mb-2">Farmer not found</h2>
        <Button variant="outline" onClick={() => navigate("/home")} className="mt-4">Back to Marketplace</Button>
      </div>
    );
  }

  const avgRating = products.length > 0
    ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1)
    : "N/A";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-testid="button-back-farmer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </button>

      {/* Farmer Profile */}
      <div className="bg-card rounded-2xl border border-card-border p-6 md:p-8 mb-8">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-farmer-profile-name">{farmer.name}</h1>
            {farmer.location && (
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="w-4 h-4 text-primary/70" />
                <span data-testid="text-farmer-profile-location">{farmer.location}</span>
              </div>
            )}
            {farmer.description && (
              <p className="text-muted-foreground mt-3 leading-relaxed max-w-xl" data-testid="text-farmer-profile-description">
                {farmer.description}
              </p>
            )}
          </div>
        </div>

        {/* Farmer Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          {[
            { label: "Products", value: products.length },
            { label: "Avg Rating", value: avgRating, icon: Star },
            { label: "Member Since", value: new Date(farmer.createdAt).getFullYear() },
          ].map(stat => (
            <div key={stat.label} className="text-center" data-testid={`farmer-stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
              <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                {stat.icon && <Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Farmer Products */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-5" data-testid="text-farmer-products-heading">
          Products by {farmer.name.split(" ")[0]}
        </h2>
        {products.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border" data-testid="empty-farmer-products">
            <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No products listed yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map(product => (
              <ProductCard key={product.id} product={product} showFarmerName={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
