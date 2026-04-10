import { User, Product, Order, CartItem, generateId, getProductImage } from "./types";

const KEYS = {
  users: "fc_users",
  currentUser: "fc_current_user",
  products: "fc_products",
  orders: "fc_orders",
};

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
  { id: "p1", farmerId: "farmer1", farmerName: "Raju Sharma", name: "Organic Tomatoes", price: 35, marketPrice: 50, quantity: 200, unit: "kg", image: getProductImage("tomato"), description: "Fresh, juicy organic tomatoes grown without pesticides. Perfect for cooking.", location: "Pune, Maharashtra", category: "Vegetables", rating: 4.5, ratingCount: 23, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "p2", farmerId: "farmer1", farmerName: "Raju Sharma", name: "Fresh Spinach", price: 20, marketPrice: 40, quantity: 50, unit: "bunch", image: getProductImage("spinach"), description: "Crispy, fresh spinach harvested this morning. Rich in iron and nutrients.", location: "Pune, Maharashtra", category: "Vegetables", rating: 4.8, ratingCount: 15, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "p3", farmerId: "farmer2", farmerName: "Priya Patel", name: "Alphonso Mangoes", price: 80, marketPrice: 140, quantity: 100, unit: "kg", image: getProductImage("mango"), description: "Premium Alphonso mangoes, hand-picked at peak ripeness. Naturally sweet.", location: "Nashik, Maharashtra", category: "Fruits", rating: 4.9, ratingCount: 41, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "p4", farmerId: "farmer2", farmerName: "Priya Patel", name: "Farm Fresh Carrots", price: 28, marketPrice: 55, quantity: 150, unit: "kg", image: getProductImage("carrot"), description: "Sweet, crunchy carrots. Great for salads, cooking, and juicing.", location: "Nashik, Maharashtra", category: "Vegetables", rating: 4.3, ratingCount: 18, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "p5", farmerId: "farmer3", farmerName: "Suresh Kumar", name: "Basmati Rice", price: 55, marketPrice: 80, quantity: 500, unit: "kg", image: getProductImage("rice"), description: "Aromatic basmati rice, aged for 1 year. Long grain, fragrant variety.", location: "Thanjavur, Tamil Nadu", category: "Grains", rating: 4.7, ratingCount: 62, createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: "p6", farmerId: "farmer3", farmerName: "Suresh Kumar", name: "Red Onions", price: 25, marketPrice: 40, quantity: 300, unit: "kg", image: getProductImage("onion"), description: "Sharp, pungent red onions. Fresh from the field, no cold storage.", location: "Thanjavur, Tamil Nadu", category: "Vegetables", rating: 4.2, ratingCount: 31, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: "p7", farmerId: "farmer1", farmerName: "Raju Sharma", name: "Fresh Potatoes", price: 20, marketPrice: 35, quantity: 400, unit: "kg", image: getProductImage("potato"), description: "All-purpose potatoes, ideal for cooking. Grown in well-drained soil.", location: "Pune, Maharashtra", category: "Vegetables", rating: 4.1, ratingCount: 27, createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: "p8", farmerId: "farmer2", farmerName: "Priya Patel", name: "Banana Bunch", price: 30, marketPrice: 50, quantity: 80, unit: "dozen", image: getProductImage("banana"), description: "Naturally ripened bananas, sweet and creamy. No artificial ripening.", location: "Nashik, Maharashtra", category: "Fruits", rating: 4.6, ratingCount: 19, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

export function initStore() {
  const users = load<User[]>(KEYS.users, []);
  if (users.length === 0) {
    save(KEYS.users, SEED_FARMERS);
  }
  const products = load<Product[]>(KEYS.products, []);
  if (products.length === 0) {
    save(KEYS.products, SEED_PRODUCTS);
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

export function addProduct(product: Omit<Product, "id" | "createdAt">): Product {
  const products = getProducts();
  const newProduct: Product = { ...product, id: generateId(), createdAt: new Date().toISOString() };
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
