import { Link, useLocation } from "wouter";
import { ShoppingCart, Leaf, Menu, X, User, LogOut, LayoutDashboard, Package, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" data-testid="link-logo">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              Farm<span className="text-primary">Connect</span>
              <span className="text-accent text-sm font-medium ml-0.5">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/home">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" data-testid="link-home">
                Marketplace
              </Button>
            </Link>
            {!user && (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" data-testid="link-login">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="ml-1" data-testid="link-signup">Get Started</Button>
                </Link>
              </>
            )}
            {user?.role === "consumer" && (
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative" data-testid="link-cart">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full" data-testid="badge-cart-count">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1" data-testid="button-user-menu">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="max-w-24 truncate text-sm">{user.name.split(" ")[0]}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === "farmer" && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/farmer-dashboard")} data-testid="menu-item-dashboard">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/farmer-orders")} data-testid="menu-item-orders">
                        <Package className="w-4 h-4 mr-2" />
                        Orders
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === "consumer" && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/orders")} data-testid="menu-item-my-orders">
                        <Package className="w-4 h-4 mr-2" />
                        My Orders
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive" data-testid="menu-item-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user?.role === "consumer" && (
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative" data-testid="link-cart-mobile">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} data-testid="button-mobile-menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-3 space-y-1">
            <Link href="/home" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start" data-testid="mobile-link-home">Marketplace</Button>
            </Link>
            {!user && (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" data-testid="mobile-link-login">Sign In</Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full justify-start" data-testid="mobile-link-signup">Get Started</Button>
                </Link>
              </>
            )}
            {user?.role === "farmer" && (
              <>
                <Link href="/farmer-dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" data-testid="mobile-link-dashboard">
                    <LayoutDashboard className="w-4 h-4 mr-2" />Dashboard
                  </Button>
                </Link>
                <Link href="/farmer-orders" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" data-testid="mobile-link-farmer-orders">
                    <Package className="w-4 h-4 mr-2" />Orders
                  </Button>
                </Link>
              </>
            )}
            {user?.role === "consumer" && (
              <Link href="/orders" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start" data-testid="mobile-link-my-orders">
                  <Package className="w-4 h-4 mr-2" />My Orders
                </Button>
              </Link>
            )}
            {user && (
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout} data-testid="mobile-button-logout">
                <LogOut className="w-4 h-4 mr-2" />Sign Out
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
