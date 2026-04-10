import { User, Product, Order, CartItem, generateId, getProductImage } from "./types";

const KEYS = {
  users: "fc_users",
  currentUser: "fc_current_user",
  products: "fc_products",
  orders: "fc_orders",
  version: "fc_data_version",
};

const CURRENT_SEED_VERSION = 2;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

const SEED_FARMERS: User[] = [
  { id: "farmer1", name: "Raju Sharma", email: "raju@farm.com", role: "farmer", description: "Organic vegetables from Pune hills. 3rd generation farmer.", location: "Pune, Maharashtra", createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: "farmer2", name: "Priya Patel", email: "priya@farm.com", role: "farmer", description: "Fresh fruits and seasonal produce from our family orchard.", location: "Nashik, Maharashtra", createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: "farmer3", name: "Suresh Kumar", email: "suresh@farm.com", role: "farmer", description: "Specializing in organic rice and grains, pesticide-free farming.", location: "Thanjavur, Tamil Nadu", createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: "consumer1", name: "Anita Desai", email: "demo@consumer.com", role: "consumer", location: "Mumbai, Maharashtra", createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
];

const SEED_PRODUCTS: Product[] = [
  { id: "p1", farmerId: "farmer1", farmerName: "Raju Sharma", farmerDescription: "3rd generation organic farmer from Pune hills, farming since 1995", name: "Organic Tomatoes", price: 35, marketPrice: 50, quantity: 200, unit: "kg", image: getProductImage("tomato"), description: "Fresh, juicy organic tomatoes grown without pesticides. Perfect for cooking.", location: "Pune, Maharashtra", category: "Vegetables", rating: 4.5, ratingCount: 23, ordersCompleted: 142, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "p2", farmerId: "farmer1", farmerName: "Raju Sharma", farmerDescription: "3rd generation organic farmer from Pune hills, farming since 1995", name: "Fresh Spinach", price: 20, marketPrice: 40, quantity: 50, unit: "bunch", image: getProductImage("spinach"), description: "Crispy, fresh spinach harvested this morning. Rich in iron and nutrients.", location: "Pune, Maharashtra", category: "Vegetables", rating: 4.8, ratingCount: 15, ordersCompleted: 78, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "p3", farmerId: "farmer2", farmerName: "Priya Patel", farmerDescription: "Family orchard owner, Nashik — growing premium fruits for 15+ years", name: "Alphonso Mangoes", price: 80, marketPrice: 140, quantity: 100, unit: "kg", image: getProductImage("mango"), description: "Premium Alphonso mangoes, hand-picked at peak ripeness. Naturally sweet.", location: "Nashik, Maharashtra", category: "Fruits", rating: 4.9, ratingCount: 41, ordersCompleted: 310, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "p4", farmerId: "farmer2", farmerName: "Priya Patel", farmerDescription: "Family orchard owner, Nashik — growing premium fruits for 15+ years", name: "Farm Fresh Carrots", price: 28, marketPrice: 55, quantity: 150, unit: "kg", image: getProductImage("carrot"), description: "Sweet, crunchy carrots. Great for salads, cooking, and juicing.", location: "Nashik, Maharashtra", category: "Vegetables", rating: 4.3, ratingCount: 18, ordersCompleted: 94, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "p5", farmerId: "farmer3", farmerName: "Suresh Kumar", farmerDescription: "Certified organic grains farmer, Thanjavur — zero-pesticide pledge since 2010", name: "Basmati Rice", price: 55, marketPrice: 80, quantity: 500, unit: "kg", image: getProductImage("rice"), description: "Aromatic basmati rice, aged for 1 year. Long grain, fragrant variety.", location: "Thanjavur, Tamil Nadu", category: "Grains", rating: 4.7, ratingCount: 62, ordersCompleted: 487, createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: "p6", farmerId: "farmer3", farmerName: "Suresh Kumar", farmerDescription: "Certified organic grains farmer, Thanjavur — zero-pesticide pledge since 2010", name: "Red Onions", price: 25, marketPrice: 40, quantity: 300, unit: "kg", image: getProductImage("onion"), description: "Sharp, pungent red onions. Fresh from the field, no cold storage.", location: "Thanjavur, Tamil Nadu", category: "Vegetables", rating: 4.2, ratingCount: 31, ordersCompleted: 203, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: "p7", farmerId: "farmer1", farmerName: "Raju Sharma", farmerDescription: "3rd generation organic farmer from Pune hills, farming since 1995", name: "Fresh Potatoes", price: 20, marketPrice: 35, quantity: 400, unit: "kg", image: getProductImage("potato"), description: "All-purpose potatoes, ideal for cooking. Grown in well-drained soil.", location: "Pune, Maharashtra", category: "Vegetables", rating: 4.1, ratingCount: 27, ordersCompleted: 165, createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: "p8", farmerId: "farmer2", farmerName: "Priya Patel", farmerDescription: "Family orchard owner, Nashik — growing premium fruits for 15+ years", name: "Banana Bunch", price: 30, marketPrice: 50, quantity: 80, unit: "dozen", image: getProductImage("banana"), description: "Naturally ripened bananas, sweet and creamy. No artificial ripening.", location: "Nashik, Maharashtra", category: "Fruits", rating: 4.6, ratingCount: 19, ordersCompleted: 128, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

export function initStore() {
  const storedVersion = load<number>(KEYS.version, 0);
  const needsMigration = storedVersion < CURRENT_SEED_VERSION;

  const users = load<User[]>(KEYS.users, []);
  if (users.length === 0 || needsMigration) {
    const existingNonSeedUsers = users.filter(u => !["farmer1", "farmer2", "farmer3", "consumer1"].includes(u.id));
    save(KEYS.users, [...SEED_FARMERS, { id: "consumer1", name: "Anita Desai", email: "demo@consumer.com", role: "consumer" as const, location: "Mumbai, Maharashtra", createdAt: new Date(Date.now() - 86400000 * 10).toISOString() }, ...existingNonSeedUsers]);
  }

  const products = load<Product[]>(KEYS.products, []);
  if (products.length === 0 || needsMigration) {
    const userProducts = products.filter(p => !["p1","p2","p3","p4","p5","p6","p7","p8"].includes(p.id));
    const migratedUserProducts = userProducts.map(p => ({
      ...p,
      ordersCompleted: p.ordersCompleted ?? 0,
    }));
    save(KEYS.products, [...SEED_PRODUCTS, ...migratedUserProducts]);
  }

  if (needsMigration) {
    save(KEYS.version, CURRENT_SEED_VERSION);
  }
}

export function getUsers(): User[] {
  return load<User[]>(KEYS.users, []);
}

export function getCurrentUser(): User | null {
  return load<User | null>(KEYS.currentUser, null);
}

export function setCurrentUser(user: User | null) {
  save(KEYS.currentUser, user);
}

export function signUp(name: string, email: string, password: string, role: "farmer" | "consumer", location?: string): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, error: "Email already registered" };
  }
  const user: User = { id: generateId(), name, email, role, location, createdAt: new Date().toISOString() };
  save(KEYS.users, [...users, user]);
  setCurrentUser(user);
  return { success: true, user };
}

export function signIn(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return { success: false, error: "No account found with this email" };
  setCurrentUser(user);
  return { success: true, user };
}

export function signOut() {
  setCurrentUser(null);
}

export function getProducts(): Product[] {
  return load<Product[]>(KEYS.products, []);
}

export function getProductsByFarmer(farmerId: string): Product[] {
  return getProducts().filter(p => p.farmerId === farmerId);
}

export function addProduct(product: Omit<Product, "id" | "createdAt" | "ordersCompleted"> & { ordersCompleted?: number }): Product {
  const products = getProducts();
  const newProduct: Product = { ...product, ordersCompleted: product.ordersCompleted ?? 0, id: generateId(), createdAt: new Date().toISOString() };
  save(KEYS.products, [...products, newProduct]);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): boolean {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return false;
  products[idx] = { ...products[idx], ...updates };
  save(KEYS.products, products);
  return true;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  save(KEYS.products, filtered);
  return true;
}

export function getFarmerById(id: string): User | undefined {
  return getUsers().find(u => u.id === id && u.role === "farmer");
}

export function getOrders(): Order[] {
  return load<Order[]>(KEYS.orders, []);
}

export function getOrdersByUser(userId: string): Order[] {
  return getOrders().filter(o => o.userId === userId);
}

export function getOrdersByFarmer(farmerId: string): Order[] {
  return getOrders().filter(o =>
    o.items.some(item => item.product.farmerId === farmerId)
  );
}

export function placeOrder(userId: string, items: CartItem[]): Order {
  const orders = getOrders();
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const savedAmount = items.reduce((sum, item) => sum + (item.product.marketPrice - item.product.price) * item.quantity, 0);
  const order: Order = { id: generateId(), userId, items, totalPrice, savedAmount, status: "Pending", createdAt: new Date().toISOString() };
  save(KEYS.orders, [...orders, order]);
  return order;
}

export function updateOrderStatus(id: string, status: "Pending" | "Delivered") {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], status };
    save(KEYS.orders, orders);
  }
}

export function updateUserProfile(id: string, updates: Partial<User>) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    save(KEYS.users, users);
    const current = getCurrentUser();
    if (current && current.id === id) {
      setCurrentUser(users[idx]);
    }
  }
}
