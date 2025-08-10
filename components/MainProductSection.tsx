// components/MainProductSection.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase"; // عدّل المسار حسب مكان ملف supabase client لديك
import type { Offer, Product } from "@/lib/type";



export interface MainProductSectionProps {
  title?: string;
  linkToAll?: string;
  products?: Array<{
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    // Add other product fields as needed
  }>;
  offer?: Offer;
  // other props if any
}

export default function MainProductSection({
  title,
  linkToAll = "/products",
  products,
  offer,
}: MainProductSectionProps) {
  const [loading, setLoading] = useState(true);
  const [productsState, setProducts] = useState<Product[]>([]);

  // Use offer title if provided, otherwise use the title prop
  const displayTitle = offer?.title || title || "Featured Products";

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      
      // If offer is provided, fetch products from homepage_offer_products
      if (offer?.homepage_offer_products && offer.homepage_offer_products.length > 0) {
        const productIds = offer.homepage_offer_products.map(item => item.product_id);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds)
          .eq("is_active", true);
        
        if (!error && data) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } else {
        // Default product fetching
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .limit(8);

        if (error) {
          setProducts([]);
        } else {
          setProducts(data || []);
        }
      }
      setLoading(false);
    }
    fetchProducts();
  }, [offer]);
  return (
    <div>
      {/* Only show title banner if no offer is provided (for default section) */}
      {!offer && (
        <div className="relative mb-6 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg h-12 flex items-center justify-center">
          <h2 className="text-xl sm:text-3xl font-extrabold text-white text-center">
            {displayTitle}
          </h2>
        </div>
      )}

      {/* شبكة الكروت */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-4 text-center py-10">جاري التحميل...</div>
        ) : productsState.length > 0 ? (
          productsState.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-4 text-center py-10">لا توجد منتجات</div>
        )}
      </div>
      {/* بانر سفلي - عرض الكل */}
      <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-md p-3 sm:p-4 flex flex-row items-center justify-between gap-2 sm:gap-4 text-base sm:text-lg">
        <Link
          href={linkToAll}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline text-sm sm:text-base"
        >
          عرض الكل
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 font-medium text-base sm:text-lg">
          <MoreHorizontal className="w-5 h-5" />
          {displayTitle}
        </div>
      </div>
    </div>
  );
}
