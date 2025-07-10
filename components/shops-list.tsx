"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import type { Shop, Category, WorkingHours } from "@/lib/type";
import { supabase } from "@/lib/supabase";

// Extend Shop type to include categoryTitle, shop_desc, shop_name, cover_image_url, and productsCount
type ShopWithDetails = Shop & {
  categoryTitle: string;
  shop_desc: string;
  shop_name: string;
  cover_image_url?: string;
  productsCount: number;
  logo_url?: string | null;
  address?: string | null;
  working_hours?: WorkingHours[] | null;
};
type SortOption = "rating" | "products" | "alphabetical" | "newest";

export default function ShopsPage() {
  const [shopsData, setShopsData] = useState<ShopWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 6;

  // جلب البيانات الحقيقية من supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // جلب المتاجر
      const { data: shops, error: shopsError } = await supabase
        .from("shops")
        .select("*");
      // جلب التصنيفات
      const { data: cats } = await supabase.from("categories").select("*");
      if (!shopsError && shops && cats) {
        setCategories(cats);
        // جلب المنتجات لكل متجر
        const { data: products } = await supabase
          .from("products")
          .select("shop_id");
        const shopsWithCount = shops.map((shop) => {
          const count = products
            ? products.filter((p) => p.shop_id === shop.id).length
            : 0;
          return {
            ...shop,
            categoryTitle:
              cats.find((cat) => cat.id === shop.category_id)?.name ||
              "بدون تصنيف",
            productsCount: count,
            shop_desc: shop.description || "",
            shop_name: shop.name,
            cover_image_url: shop.background_image_url || "",
            logo_url: shop.logo_url || "",
            address: shop.address || "",
            working_hours: shop.working_hours || [],
          };
        });
        setShopsData(shopsWithCount);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filter and sort shops
  const filteredAndSortedShops = useMemo(() => {
    const filtered = shopsData.filter(
      (shop) =>
        shop.shop_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.shop_desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort based on selected option
    switch (sortBy) {
      case "rating":
        filtered.sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "products":
        filtered.sort(
          (a: any, b: any) => (b.productsCount ?? 0) - (a.productsCount ?? 0)
        );
        break;
      case "alphabetical":
        filtered.sort((a, b) =>
          (a.shop_name ?? "").localeCompare(b.shop_name ?? "")
        );
        break;
      case "newest":
        filtered.sort((a, b) => Number(b.id) - Number(a.id));
        break;
    }

    return filtered;
  }, [shopsData, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedShops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShops = filteredAndSortedShops.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Discover Amazing Shops
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Find the best stores in your area
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for shops, categories, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>

              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="products">Most Products</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {paginatedShops.length} of {filteredAndSortedShops.length}{" "}
              shops
            </div>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-500">
            جاري التحميل...
          </div>
        ) : paginatedShops.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No shops found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedShops.map((shop) => (
              <Card
                key={shop.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  {/* Shop Cover Image */}
                  <div className="relative h-48 overflow-hidden flex items-center justify-center">
                    <Image
                      src={shop.cover_image_url || "/placeholder.svg"}
                      alt={shop.shop_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Shop Logo في المنتصف */}
                    <div
                      className="absolute left-1/2"
                      style={{
                        bottom: "1rem",
                        transform: "translateX(-50%)",
                        zIndex: 10,
                        pointerEvents: "none",
                      }}
                    >
                      <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center">
                        <Image
                          src={shop.logo_url || "/placeholder.svg"}
                          alt={`${shop.shop_name} logo`}
                          width={80}
                          height={80}
                          className="object-cover w-20 h-20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="p-6 pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {shop.shop_name}
                      </h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap ms-auto">
                        {shop.categoryTitle}
                      </span>
                    </div>

                    {/* الوصف */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {shop.shop_desc}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-2 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {/* {shop.rating ?? "-"} */}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {/* {shop.reviews ? `(${shop.reviews})` : ""} */}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 mb-1">
                          <Package className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {shop.productsCount ?? "-"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Products
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="font-semibold text-gray-900 dark:text-white text-xs">
                            {/* {shop.delivery_time ?? "-"} */}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Delivery
                        </span>
                      </div>
                    </div>
                    {/* الكاتيجوري */}
                    <div className="flex items-center gap-2 mb-1">
                      <Badge>{shop.categoryTitle}</Badge>
                    </div>
                    {/* الموقع */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <MapPin className="h-4 w-4" />
                      {shop.address}
                    </div>

                    {/* ساعات العمل */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <Clock className="h-3 w-3" />
                      {(() => {
                        let workHoursArr: WorkingHours[] = [];
                        if (Array.isArray(shop.working_hours)) {
                          workHoursArr = shop.working_hours as WorkingHours[];
                        }
                        // استدعاء اليوم الحالي فقط
                        const days = [
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ];
                        const today = days[new Date().getDay()];
                        const todayWork = workHoursArr.find(
                          (h) => h.day === today
                        );
                        return todayWork
                          ? todayWork.is_open
                            ? `${todayWork.day}: ${todayWork.open_time} - ${todayWork.close_time}`
                            : `${todayWork.day}: مغلق`
                          : "لا يوجد دوام اليوم";
                      })()}
                    </div>

                    {/* Visit Button */}
                    <div className="flex justify-end">
                      <Link href={`/shops/${shop.id}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm">
                          زيارة المتجر
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
