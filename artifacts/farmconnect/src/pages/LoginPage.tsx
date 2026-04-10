import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);
    if (result.success) {
      toast({ title: "Welcome back!", description: "You are now signed in." });
      const currentUser = JSON.parse(localStorage.getItem("fc_current_user") || "null");
      if (currentUser?.role === "farmer") {
        navigate("/farmer-dashboard");
      } else {
        navigate("/home");
      }
    } else {
      toast({ title: "Sign in failed", description: result.error, variant: "destructive" });
    }
  };

  const demoAccounts = [
    { label: "Demo Farmer", email: "raju@farm.com", password: "any" },
    { label: "Demo Consumer", email: "demo@consumer.com", password: "any" },
  ];

  const fillDemo = (email: string) => {
    form.setValue("email", email);
    form.setValue("password", "password");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-card-border shadow-md p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-3">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-login-heading">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your FarmConnect account</p>
          </div>

          {/* Demo Accounts */}
          <div className="mb-6 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-2">Try a demo account:</p>
            <div className="flex gap-2">
              {demoAccounts.map(acc => (
                <Button key={acc.email} variant="outline" size="sm" className="text-xs flex-1" onClick={() => fillDemo(acc.email)} data-testid={`button-demo-${acc.label.toLowerCase().replace(" ", "-")}`}>
                  {acc.label}
                </Button>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...field} data-testid="input-password" />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading} data-testid="button-submit-login">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline" data-testid="link-signup">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
