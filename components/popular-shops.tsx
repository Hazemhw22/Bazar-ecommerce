"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Package, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { ShopPreview } from "@/lib/type";

export function PopularShops() {
  const [featuredShops, setFeaturedShops] = useState<ShopPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedShops() {
      try {
        const { data, error } = await supabase
          .from("homepage_featured_stores")
          .select(`
            id,
            position,
            is_active,
            shops:shop_id (
              id,
              name,
              logo_url,
              description,
              address,
              background_image_url
            )
          `)
          .eq("is_active", true)
          .order("position", { ascending: true })
          .limit(6);

        if (error) {
          console.error("Error fetching featured shops:", error);
          setFeaturedShops([]);
        } else {
          // Process the data to flatten the shops array
          const processedShops = (data || []).map((item: any) => ({
            ...item.shops,
            position: item.position
          }));
          setFeaturedShops(processedShops);
        }
      } catch (error) {
        console.error("Error fetching featured shops:", error);
        setFeaturedShops([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedShops();
  }, []);

  if (loading) {
    return (
      <section className="py-6 px-2">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري تحميل المتاجر المميزة...</p>
        </div>
      </section>
    );
  }

  if (featuredShops.length === 0) {
    return null; // Don't show anything if no featured shops
  }

  return (
    <section className="py-6 px-2">
      {/* Header Banner */}
      <div className="relative mb-6 rounded-xl overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 shadow-lg h-12 flex items-center justify-center">
        <h2 className="text-xl sm:text-3xl font-extrabold text-white text-center">
          المتاجر المميزة
        </h2>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredShops.map((shop) => (
          <Card
            key={shop.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <CardContent className="p-0">
              {/* Shop Cover Image */}
              <div className="relative h-32 overflow-hidden flex items-center justify-center">
                <Image
                  src={shop.background_image_url || "/placeholder.svg"}
                  alt={shop.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20" />

                {/* Shop Logo */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center">
                    <Image
                      src={shop.logo_url || "/placeholder.svg"}
                      alt={`${shop.name} logo`}
                      width={64}
                      height={64}
                      className="object-cover w-16 h-16"
                    />
                  </div>
                </div>
              </div>

              {/* Shop Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {shop.name}
                  </h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    مميز
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {shop.description || "متجر مميز في منصة البازار"}
                </p>

                {/* Address */}
                {shop.address && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{shop.address}</span>
                  </div>
                )}

                {/* Visit Button */}
                <div className="flex justify-end">
                  <Link href={`/shops/${shop.id}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                      زيارة المتجر
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Banner - View All */}
      <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-md p-3 sm:p-4 flex flex-row items-center justify-between gap-2 sm:gap-4 text-base sm:text-lg">
        <Link
          href="/shops"
          className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold hover:underline text-sm sm:text-base"
        >
          عرض جميع المتاجر
          <MapPin className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 font-medium text-base sm:text-lg">
          <Star className="w-5 h-5" />
          المتاجر المميزة
        </div>
      </div>
    </section>
  );
} 