"use client";

import { ProductCard } from "./ProductCard";
import type { Product, Category } from "@/lib/type";

export function ProductsList({ products }: { products: Product[] }) {
  return (
    <section className="py-6">
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
