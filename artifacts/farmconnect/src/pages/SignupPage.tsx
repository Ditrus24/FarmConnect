import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, Eye, EyeOff, Sprout, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["farmer", "consumer"]),
  location: z.string().optional(),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { register } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", role: "consumer", location: "" },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    const result = await register(data.name, data.email, data.password, data.role, data.location);
    setLoading(false);
    if (result.success) {
      toast({ title: "Account created!", description: "Welcome to FarmConnect AI." });
      navigate(data.role === "farmer" ? "/farmer-dashboard" : "/home");
    } else {
      toast({ title: "Registration failed", description: result.error, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-card-border shadow-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-3">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-signup-heading">Join FarmConnect AI</h1>
            <p className="text-muted-foreground text-sm mt-1">Connect farmers and consumers directly</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "consumer", label: "Consumer", desc: "Buy fresh produce", Icon: ShoppingBag },
                    { value: "farmer", label: "Farmer", desc: "Sell my produce", Icon: Sprout },
                  ].map(({ value, label, desc, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => form.setValue("role", value as "farmer" | "consumer")}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        selectedRole === value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      )}
                      data-testid={`button-role-${value}`}
                    >
                      <Icon className={cn("w-5 h-5 mb-1.5", selectedRole === value ? "text-primary" : "text-muted-foreground")} />
                      <div className="text-sm font-medium text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <Input type={showPassword ? "text" : "password"} placeholder="Min 6 characters" {...field} data-testid="input-password" />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Pune, Maharashtra" {...field} data-testid="input-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-2" disabled={loading} data-testid="button-submit-signup">
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline" data-testid="link-login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
