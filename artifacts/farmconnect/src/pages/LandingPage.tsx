import { Link } from "wouter";
import { Leaf, TrendingDown, Users, ShieldCheck, ArrowRight, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();
  const featuredProducts = getProducts().slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=60')] bg-cover bg-center opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1" data-testid="badge-hero-tag">
              <Leaf className="w-3.5 h-3.5 mr-1.5" />
              Producer to Consumer Marketplace
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6" data-testid="text-hero-headline">
              Fresh from the{" "}
              <span className="text-primary">Farm</span>{" "}
              to Your{" "}
              <span className="text-accent">Table</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="text-hero-description">
              Buy directly from local farmers at fair prices. No middlemen, no markups — just honest food at honest prices with AI-powered transparency.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {user ? (
                <Link href={user.role === "farmer" ? "/farmer-dashboard" : "/home"}>
                  <Button size="lg" className="gap-2 px-8" data-testid="button-hero-cta-primary">
                    {user.role === "farmer" ? "Go to Dashboard" : "Shop Now"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/home">
                    <Button size="lg" className="gap-2 px-8" data-testid="button-hero-shop">
                      Browse Marketplace
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="lg" variant="outline" className="gap-2 px-8" data-testid="button-hero-signup">
                      Sell Your Produce
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { value: "500+", label: "Farmers" },
              { value: "10K+", label: "Products" },
              { value: "30%", label: "Avg. Savings" },
              { value: "50K+", label: "Happy Buyers" },
            ].map((stat) => (
              <div key={stat.label} className="text-center" data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-3" data-testid="text-features-heading">Why FarmConnect AI?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Technology meeting tradition for a better food system
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingDown,
                title: "Fair Prices",
                description: "AI-powered price suggestions ensure farmers earn fairly while consumers save compared to market rates.",
                color: "text-primary bg-primary/10",
              },
              {
                icon: Users,
                title: "Direct Connection",
                description: "No middlemen means the money goes directly to the farmer who grew your food.",
                color: "text-accent bg-accent/10",
              },
              {
                icon: ShieldCheck,
                title: "Quality Guaranteed",
                description: "Verified farmers, transparent sourcing, and real consumer reviews for every product.",
                color: "text-blue-600 bg-blue-50",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl bg-card border border-card-border hover:shadow-md transition-shadow" data-testid={`feature-${feature.title.toLowerCase().replace(" ", "-")}`}>
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground" data-testid="text-featured-heading">Fresh Today</h2>
              <p className="text-muted-foreground mt-1">Harvested and listed this week</p>
            </div>
            <Link href="/home">
              <Button variant="outline" className="gap-1" data-testid="button-view-all">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <div key={product.id} className="bg-card rounded-xl border border-card-border overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5" data-testid={`featured-card-${product.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
                    Save ₹{product.marketPrice - product.price}/{product.unit}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-1 mb-2">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{product.location}</span>
                    <span className="ml-auto flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-muted-foreground">{product.rating}</span>
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-primary">₹{product.price}</span>
                    <span className="text-sm text-muted-foreground">/{product.unit}</span>
                    <span className="text-sm text-muted-foreground line-through ml-1">₹{product.marketPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-cta-heading">Are you a farmer?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Join thousands of farmers who sell directly to consumers. Get AI-powered price suggestions and reach customers without any commission.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="gap-2 px-8" data-testid="button-cta-farmer-signup">
              Start Selling Today
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
