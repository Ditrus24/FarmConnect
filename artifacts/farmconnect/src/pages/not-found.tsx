import { Link } from "wouter";
import { Leaf, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Leaf className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-3">Page not found</h2>
        <p className="text-muted-foreground mb-8">This page doesn't exist or has been moved.</p>
        <Link href="/">
          <Button className="gap-2" data-testid="button-go-home">
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
