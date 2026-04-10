import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Plus, Edit2, Trash2, Package, TrendingUp, Sparkles, X, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { getProductsByFarmer, addProduct, deleteProduct, updateProduct } from "@/lib/store";
import { Product, PRODUCT_CATEGORIES, getAiPriceSuggestion, getProductImage } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const productSchema = z.object({
  name: z.string().min(2, "Product name required"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  marketPrice: z.coerce.number().min(1, "Market price required"),
  quantity: z.coerce.number().min(1, "Quantity required"),
  unit: z.string().min(1, "Unit required"),
  category: z.string().min(1, "Category required"),
  description: z.string().min(10, "Add a short description"),
  location: z.string().min(2, "Location required"),
  image: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function FarmerDashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{ min: number; max: number; marketPrice: number } | null>(null);
  const [refresh, setRefresh] = useState(0);

  if (!user || user.role !== "farmer") {
    navigate("/login");
    return null;
  }

  const products = getProductsByFarmer(user.id);
  const totalRevenue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", price: 0, marketPrice: 0, quantity: 0,
      unit: "kg", category: "Vegetables", description: "", location: user.location || "",
    },
  });

  const watchedName = form.watch("name");

  const handleNameChange = (name: string) => {
    const suggestion = getAiPriceSuggestion(name);
    setAiSuggestion(suggestion);
  };

  const applyAiPrice = () => {
    if (aiSuggestion) {
      const midPrice = Math.round((aiSuggestion.min + aiSuggestion.max) / 2);
      form.setValue("price", midPrice);
      form.setValue("marketPrice", aiSuggestion.marketPrice);
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      price: product.price,
      marketPrice: product.marketPrice,
      quantity: product.quantity,
      unit: product.unit,
      category: product.category,
      description: product.description,
      location: product.location,
      image: product.image,
    });
    const suggestion = getAiPriceSuggestion(product.name);
    setAiSuggestion(suggestion);
    setShowForm(true);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    form.reset({ name: "", price: 0, marketPrice: 0, quantity: 0, unit: "kg", category: "Vegetables", description: "", location: user.location || "" });
    setAiSuggestion(null);
    setShowForm(true);
  };

  const onSubmit = (data: ProductForm) => {
    const imageUrl = data.image || getProductImage(data.name);
    if (editingProduct) {
      updateProduct(editingProduct.id, { ...data, image: imageUrl });
      toast({ title: "Product updated", description: `${data.name} has been updated.` });
    } else {
      addProduct({
        ...data,
        image: imageUrl,
        farmerId: user.id,
        farmerName: user.name,
        rating: 4.5,
        ratingCount: 0,
      });
      toast({ title: "Product added!", description: `${data.name} is now live on the marketplace.` });
    }
    setShowForm(false);
    setRefresh(r => r + 1);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Delete "${product.name}"?`)) {
      deleteProduct(product.id);
      toast({ title: "Product deleted", description: `${product.name} has been removed.` });
      setRefresh(r => r + 1);
    }
  };

  const freshProducts = getProductsByFarmer(user.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-dashboard-heading">Farmer Dashboard</h1>
          <p className="text-muted-foreground mt-0.5">Welcome back, {user.name.split(" ")[0]}</p>
        </div>
        <Button onClick={openAddForm} className="gap-2" data-testid="button-add-product">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Products", value: freshProducts.length, icon: Package, color: "bg-primary/10 text-primary" },
          { label: "Total Quantity", value: `${freshProducts.reduce((s, p) => s + p.quantity, 0)} units`, icon: TrendingUp, color: "bg-accent/10 text-accent" },
          { label: "Avg. Savings for Buyers", value: `${freshProducts.length > 0 ? Math.round(freshProducts.reduce((s, p) => s + Math.round(((p.marketPrice - p.price) / p.marketPrice) * 100), 0) / freshProducts.length) : 0}%`, icon: TrendingUp, color: "bg-green-100 text-green-700" },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-xl border border-card-border p-5" data-testid={`stat-${stat.label.toLowerCase().replace(/ /g, "-")}`}>
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">My Products</h2>
        <Link href="/farmer-orders">
          <Button variant="outline" size="sm" data-testid="button-view-orders">View Orders</Button>
        </Link>
      </div>

      {freshProducts.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border" data-testid="empty-products">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground mb-2">No products yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Add your first product to start selling</p>
          <Button onClick={openAddForm} className="gap-2" data-testid="button-add-first-product">
            <Plus className="w-4 h-4" />Add Product
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {freshProducts.map(product => (
            <div key={product.id} className="bg-card rounded-xl border border-card-border overflow-hidden" data-testid={`farmer-product-${product.id}`}>
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => openEditForm(product)}
                    className="w-7 h-7 rounded-lg bg-white/90 dark:bg-card/90 flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm transition-colors"
                    data-testid={`button-edit-${product.id}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="w-7 h-7 rounded-lg bg-white/90 dark:bg-card/90 flex items-center justify-center text-muted-foreground hover:text-destructive shadow-sm transition-colors"
                    data-testid={`button-delete-${product.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-sm">{product.name}</h3>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {product.location}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-primary">₹{product.price}</span>
                      <span className="text-xs text-muted-foreground">/{product.unit}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{product.quantity} {product.unit} available</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="dialog-product-form">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Organic Tomatoes"
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          handleNameChange(e.target.value);
                        }}
                        data-testid="input-product-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AI Suggestion */}
              {aiSuggestion && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3" data-testid="ai-suggestion">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI Price Suggestion</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Suggested price: <strong>₹{aiSuggestion.min}–₹{aiSuggestion.max}</strong> / unit
                    &nbsp;(market: ₹{aiSuggestion.marketPrice})
                  </p>
                  <Button type="button" variant="outline" size="sm" className="mt-2 text-xs" onClick={applyAiPrice} data-testid="button-apply-ai-price">
                    Apply Suggestion
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} data-testid="input-price" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} data-testid="input-market-price" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} data-testid="input-quantity" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger data-testid="select-unit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["kg", "gram", "liter", "piece", "dozen", "bunch", "bag"].map(u => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.filter(c => c !== "All").map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Pune, Maharashtra" {...field} data-testid="input-product-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product — freshness, farming method, etc."
                        className="resize-none h-20"
                        {...field}
                        data-testid="textarea-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                    <FormControl>
                      <Input placeholder="https://... (auto-filled if empty)" {...field} data-testid="input-image-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)} data-testid="button-cancel-form">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" data-testid="button-submit-product">
                  {editingProduct ? "Update Product" : "List Product"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
