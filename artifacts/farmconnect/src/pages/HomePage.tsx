import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/store";
import { PRODUCT_CATEGORIES } from "@/lib/types";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [locationFilter, setLocationFilter] = useState("");

  const allProducts = getProducts();

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (locationFilter.trim()) {
      const loc = locationFilter.toLowerCase().trim();
      result = result.filter(p => p.location.toLowerCase().includes(loc));
    }

    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "savings":
        result.sort((a, b) => (b.marketPrice - b.price) - (a.marketPrice - a.price));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [allProducts, search, selectedCategory, sortBy, locationFilter]);

  const hasFilters = search || selectedCategory !== "All" || locationFilter;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setLocationFilter("");
    setSortBy("newest");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1" data-testid="text-marketplace-heading">Fresh Marketplace</h1>
        <p className="text-muted-foreground">Direct from farmers, delivered to you</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-card rounded-xl border border-card-border p-4 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, farmer, or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
          <div className="relative flex-1 sm:max-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className="pl-9"
              data-testid="input-location-filter"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="sm:max-w-[160px]" data-testid="select-sort">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="savings">Best Savings</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-3">
          {PRODUCT_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/70 text-muted-foreground"
              }`}
              data-testid={`button-category-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {search && <Badge variant="secondary" className="gap-1">{search} <X className="w-3 h-3 cursor-pointer" onClick={() => setSearch("")} /></Badge>}
          {locationFilter && <Badge variant="secondary" className="gap-1">{locationFilter} <X className="w-3 h-3 cursor-pointer" onClick={() => setLocationFilter("")} /></Badge>}
          {selectedCategory !== "All" && <Badge variant="secondary" className="gap-1">{selectedCategory} <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("All")} /></Badge>}
          <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={clearFilters} data-testid="button-clear-filters">Clear all</Button>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground" data-testid="text-results-count">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20" data-testid="empty-state-products">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={clearFilters} data-testid="button-reset-search">Clear Filters</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
