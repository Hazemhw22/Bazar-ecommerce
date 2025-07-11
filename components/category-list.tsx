"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowRight, Package, TrendingUp } from "lucide-react";
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
import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/type";

type SortOption = "title" | "products" | "trending";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  const [productCounts, setProductCounts] = useState<Record<string, number>>(
    {}
  );

  // جلب التصنيفات من قاعدة البيانات
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data as Category[];
    },
  });

  // جلب عدد المنتجات لكل تصنيف
  useEffect(() => {
    const fetchCounts = async () => {
      if (!categories.length) return;
      const counts: Record<string, number> = {};
      for (const cat of categories) {
        const { count } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("category_id", cat.id);
        counts[cat.id] = count || 0;
      }
      setProductCounts(counts);
    };
    fetchCounts();
  }, [categories]);

  // يمكنك إبقاء trending وهمي أو ربطه بجدول آخر
  const categoriesWithExtra = categories.map((cat) => ({
    ...cat,
    productCount: productCounts[cat.id] ?? 0,
    trending: Math.random() > 0.5,
    image: cat.logo_url || "/placeholder.svg?height=200&width=300",
    color: "from-blue-500 to-purple-600",
    title: cat.name ?? "", // متوافق مع type.ts، حيث name هو اسم التصنيف
    desc: cat.description ?? "", // متوافق مع type.ts، حيث description هو وصف التصنيف
  }));

  // فلترة وفرز التصنيفات
  const filteredAndSortedCategories = categoriesWithExtra
    .filter((category) => {
      const matchesSearch =
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTrending = !showTrendingOnly || category.trending;
      return matchesSearch && matchesTrending;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "products":
          return b.productCount - a.productCount;
        case "trending":
          return Number(b.trending) - Number(a.trending);
        case "title":
        default:
          return a.title.localeCompare(b.title);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Categories
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover thousands of products across all categories. Find exactly
              what you're looking for.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Select
                  value={sortBy}
                  onValueChange={(value: SortOption) => setSortBy(value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Alphabetical</SelectItem>
                    <SelectItem value="products">Most Products</SelectItem>
                    <SelectItem value="trending">Trending First</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={showTrendingOnly ? "default" : "outline"}
                  onClick={() => setShowTrendingOnly(!showTrendingOnly)}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Trending Only
                </Button>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredAndSortedCategories.length} of{" "}
                {categories.length} categories
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            حدث خطأ أثناء جلب التصنيفات
          </div>
        ) : filteredAndSortedCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedCategories.map((category) => (
              <Card
                key={category.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white dark:bg-gray-800"
              >
                <CardContent className="p-0">
                  {/* Category Image with Gradient Overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`}
                    />

                    {/* Trending Badge */}
                    {category.trending && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                          🔥 Trending
                        </Badge>
                      </div>
                    )}

                    {/* Category Name Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="p-6 space-y-4">
                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {category.desc}
                    </p>

                    {/* Product Count */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Package className="h-4 w-4" />
                      <span>
                        {category.productCount.toLocaleString()} products
                        available
                      </span>
                    </div>

                    {/* View Products Button */}
                    <Link href={`/categories/${category.id}`} className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-blue-700">
                        View Products
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
