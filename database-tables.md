# Database Tables & Types

## Core Tables

### 1. **profiles** (User Profiles)
```typescript
export type Profile = {
  id: string; // UUID - linked to auth.users.id
  full_name: string | null;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  avatar_url?: string | null;
  phone_number?: string | null;
  address?: string | null;
};

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer", 
  VENDOR = "vendor",
  STAFF = "staff",
}
```

### 2. **shops** (Stores)
```typescript
export type Shop = {
  id: string; // UUID
  name: string;
  description?: string | null;
  owner_id: string; // UUID - references profiles.id
  email: string;
  phone_number?: string | null;
  address?: string | null;
  logo_url?: string | null;
  background_image_url?: string | null;
  is_active: boolean;
  working_hours?: WorkingHours[] | null;
  timezone?: string | null;
  delivery_time_from?: number | null; // minutes
  delivery_time_to?: number | null; // minutes
  created_at: string;
  updated_at: string;
};

export type WorkingHours = {
  day: string;
  open_time: string;
  close_time: string;
  is_open: boolean;
};
```

### 3. **categories** (Product Categories)
```typescript
export type Category = {
  id: string; // UUID
  name: string;
  description?: string | null;
  parent_id?: string | null; // UUID - self-reference for subcategories
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
};
```

### 4. **products** (Products)
```typescript
export type Product = {
  id: string; // UUID
  name: string;
  description: string | null;
  price: number;
  discount_price?: number | null;
  stock_quantity: number;
  category_id: string; // UUID - references categories.id
  shop_id: string; // UUID - references shops.id
  main_image?: string | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  specifications?: Record<string, any> | null;
  properties?: { title: string; options: string[] }[] | null;
};
```

### 5. **orders** (Orders)
```typescript
export type Order = {
  id: string; // UUID
  customer_id: string; // UUID - references profiles.id
  status: OrderStatus;
  total_amount: number;
  shipping_address: Address;
  billing_address: Address;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  tracking_number?: string | null;
  notes?: string | null;
};

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing", 
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  PAYPAL = "paypal",
  BANK_TRANSFER = "bank_transfer",
  CASH_ON_DELIVERY = "cash_on_delivery",
}

export type Address = {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
};
```

### 6. **order_items** (Order Items)
```typescript
export type OrderItem = {
  id: string; // UUID
  order_id: string; // UUID - references orders.id
  product_id: string; // UUID - references products.id
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name: string;
  product_image?: string | null;
};
```

### 7. **reviews** (Product Reviews)
```typescript
export type Review = {
  id: string; // UUID
  product_id: string; // UUID - references products.id
  customer_id: string; // UUID - references profiles.id
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
};
```

### 8. **carts** (Shopping Carts)
```typescript
export type Cart = {
  id: string; // UUID
  customer_id: string; // UUID - references profiles.id
  created_at: string;
  updated_at: string;
};
```

### 9. **cart_items** (Cart Items)
```typescript
export type CartItem = {
  id: string; // UUID
  cart_id: string; // UUID - references carts.id
  product_id: string; // UUID - references products.id
  quantity: number;
  added_at: string;
};
```

### 10. **wishlists** (Favorites/Wishlist)
```typescript
export type Wishlist = {
  id: string; // UUID
  customer_id: string; // UUID - references profiles.id
  product_id: string; // UUID - references products.id
  added_at: string;
};
```

### 11. **notifications** (User Notifications)
```typescript
export type Notification = {
  id: string; // UUID
  user_id: string; // UUID - references profiles.id
  message: string;
  created_at: string;
};
```

### 12. **coupons** (Discount Coupons)
```typescript
export type Coupon = {
  id: string; // UUID
  code: string;
  discount_type: string;
  discount_value: number;
  usage_limit: number;
  usage_count: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
};
```

## Homepage Management Tables

### 13. **homepage_offers** (Special Offers)
```typescript
export interface Offer = {
  id: string; // UUID
  title: string;
  created_at?: string;
  updated_at?: string;
};
```

### 14. **homepage_offer_products** (Offer-Product Relationships)
```typescript
export type HomepageOfferProduct = {
  id: string; // UUID
  offer_id: string; // UUID - references homepage_offers.id
  product_id: string; // UUID - references products.id
};
```

### 15. **homepage_featured_stores** (Featured Stores)
```typescript
export type HomepageFeaturedStore = {
  id: string; // UUID
  shop_id: string; // UUID - references shops.id
  position: number; // Display order
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};
```

### 16. **homepage_sections** (Homepage Sections)
```typescript
export type HomepageSection = {
  id: string; // UUID
  shop_id: string; // UUID - references shops.id
  position: number; // Display order
  is_active: boolean;
  title?: string;
  created_at?: string;
  updated_at?: string;
};
```

## Helper Types

### 17. **ShopPreview** (Lightweight Shop Data)
```typescript
export type ShopPreview = {
  id: string;
  name: string;
  logo_url?: string | null;
  description?: string | null;
  address?: string | null;
  background_image_url?: string | null;
  position?: number;
};
```

## Database Interface

```typescript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      shops: {
        Row: Shop;
        Insert: Omit<Shop, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Shop, "id" | "created_at" | "updated_at">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Category, "id" | "created_at" | "updated_at">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id" | "created_at" | "updated_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Order, "id" | "created_at" | "updated_at">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id">;
        Update: Partial<Omit<OrderItem, "id">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Review, "id" | "created_at" | "updated_at">>;
      };
      carts: {
        Row: Cart;
        Insert: Omit<Cart, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Cart, "id" | "created_at" | "updated_at">>;
      };
      cart_items: {
        Row: CartItem;
        Insert: Omit<CartItem, "id" | "added_at">;
        Update: Partial<Omit<CartItem, "id" | "added_at">>;
      };
      wishlists: {
        Row: Wishlist;
        Insert: Omit<Wishlist, "id" | "added_at">;
        Update: Partial<Omit<Wishlist, "id" | "added_at">>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, "id" | "created_at">;
        Update: Partial<Omit<Notification, "id" | "created_at">>;
      };
      coupons: {
        Row: Coupon;
        Insert: Omit<Coupon, "id" | "created_at" | "updated_at" | "usage_count">;
        Update: Partial<Omit<Coupon, "id" | "created_at" | "updated_at">>;
      };
      homepage_offers: {
        Row: Offer;
        Insert: Omit<Offer, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Offer, "id" | "created_at" | "updated_at">>;
      };
      homepage_offer_products: {
        Row: HomepageOfferProduct;
        Insert: Omit<HomepageOfferProduct, "id">;
        Update: Partial<Omit<HomepageOfferProduct, "id">>;
      };
      homepage_featured_stores: {
        Row: HomepageFeaturedStore;
        Insert: Omit<HomepageFeaturedStore, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<HomepageFeaturedStore, "id" | "created_at" | "updated_at">>;
      };
      homepage_sections: {
        Row: HomepageSection;
        Insert: Omit<HomepageSection, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<HomepageSection, "id" | "created_at" | "updated_at">>;
      };
    };
  };
}
```

## Summary

**Total Tables: 16**

### Core E-commerce Tables (12):
1. profiles
2. shops  
3. categories
4. products
5. orders
6. order_items
7. reviews
8. carts
9. cart_items
10. wishlists
11. notifications
12. coupons

### Homepage Management Tables (4):
13. homepage_offers
14. homepage_offer_products
15. homepage_featured_stores
16. homepage_sections

All tables use UUID primary keys and include proper foreign key relationships for data integrity. 