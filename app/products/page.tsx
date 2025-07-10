"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { DualRangeSlider } from "../../components/ui/dualrangeslider";
import { ProductsList } from "../../components/product-list";
import { ChevronDown, SlidersHorizontal, X, Search } from "lucide-react";
import SortIcon from "../../components/SortIcon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Dialog } from "@headlessui/react";

const SORT_OPTIONS = [
  { label: "الأحدث", value: "newest" },
  { label: "الأقدم", value: "oldest" },
  { label: "الأرخص", value: "price-asc" },
  { label: "الأغلى", value: "price-desc" },
];

export default function Products() {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [brands, setBrands] = useState<string[]>(["All"]);
  const [sort, setSort] = useState("newest");

  useQuery({
    queryKey: ["categories-brands"],
    queryFn: async () => {
      const { data: cats } = await supabase.from("categories").select("name");
      const { data: shops } = await supabase.from("shops").select("name");
      setCategories([
        "All",
        ...(cats?.map((c: any) => c.name).filter(Boolean) ?? []),
      ]);
      setBrands([
        "All",
        ...(shops?.map((s: any) => s.name).filter(Boolean) ?? []),
      ]);
      return null;
    },
  });

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, shops:shops(name), categories:categories(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((product: any) => ({
        ...product,
        shops:
          product.shops && Array.isArray(product.shops)
            ? product.shops[0]
            : product.shops,
        categories:
          product.categories && Array.isArray(product.categories)
            ? product.categories[0]
            : product.categories,
      }));
    },
    refetchInterval: 5000,
  });

  // فلترة المنتجات
  const filteredProducts = useMemo(() => {
    let result = products
      .filter((product: any) =>
        search
          ? product.name?.toLowerCase().includes(search.toLowerCase()) ||
            product.description?.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .filter((product: any) =>
        selectedCategory !== "All"
          ? product.categories?.name === selectedCategory
          : true
      )
      .filter((product: any) =>
        selectedBrand !== "All" ? product.shops?.name === selectedBrand : true
      )
      .filter(
        (product: any) =>
          Number(product.price) >= minPrice && Number(product.price) <= maxPrice
      );
    // ترتيب
    switch (sort) {
      case "price-asc":
        result = result.sort(
          (a: any, b: any) => Number(a.price) - Number(b.price)
        );
        break;
      case "price-desc":
        result = result.sort(
          (a: any, b: any) => Number(b.price) - Number(a.price)
        );
        break;
      case "oldest":
        result = result.sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      default:
        result = result.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
    return result;
  }, [
    products,
    search,
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    sort,
  ]);

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4">
      {/* Mobile filter button */}
      <div className="md:hidden mb-4 flex justify-end">
        <Button onClick={() => setFilterOpen(true)} variant="outline" size="sm">
          <SlidersHorizontal size={16} />
          <span className="ml-2">فلاتر</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters - ديسكتوب فقط */}
        <aside className="hidden md:block md:w-1/4 sticky top-20 self-start bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-400 dark:border-blue-800">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <SlidersHorizontal size={20} />
            الفلاتر
          </h2>

          {/* Category Filter - ديسكتوب */}
          <div className="mb-6">
            <label className="font-semibold block mb-1">التصنيف</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700 focus:outline-none"
                >
                  {selectedCategory}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command className="w-full">
                  <CommandInput
                    placeholder="ابحث عن تصنيف..."
                    className="w-full px-3 py-2"
                  />
                  <CommandList>
                    <CommandEmpty>لا يوجد تصنيفات.</CommandEmpty>
                    <CommandGroup className="w-full">
                      {categories.map((option) => (
                        <CommandItem
                          key={option}
                          onSelect={() => setSelectedCategory(option)}
                          className="w-full text-sm text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700"
                        >
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Brand Filter - ديسكتوب */}
          <div className="mb-6">
            <label className="font-semibold block mb-1">المتجر</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700 focus:outline-none"
                >
                  {selectedBrand}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command className="w-full">
                  <CommandInput
                    placeholder="ابحث عن متجر..."
                    className="w-full px-3 py-2"
                  />
                  <CommandList>
                    <CommandEmpty>لا يوجد متاجر.</CommandEmpty>
                    <CommandGroup className="w-full">
                      {brands.map((option) => (
                        <CommandItem
                          key={option}
                          onSelect={() => setSelectedBrand(option)}
                          className="w-full text-sm text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700"
                        >
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Price Range - ديسكتوب */}
          <div className="space-y-4 mb-6">
            <h3 className="font-medium">نطاق السعر</h3>
            <div className="flex justify-between text-sm">
              <span>{minPrice} ₪</span>
              <span>{maxPrice} ₪</span>
            </div>
            <div className="px-2">
              <DualRangeSlider
                min={0}
                max={10000}
                minValue={minPrice}
                maxValue={maxPrice}
                step={10}
                onChange={({ min, max }) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
              />
            </div>
          </div>
        </aside>

        {/* Products content */}
        <section className="w-full md:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              المنتجات
            </h1>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  className="w-full border border-gray-400 dark:border-blue-800 pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 whitespace-nowrap border border-gray-400 dark:border-blue-800"
                  >
                    <SortIcon className="w-6 h-6 text-gray-500 dark:text-gray-200" />
                    ترتيب
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSort(option.value)}
                      className={
                        sort === option.value
                          ? "bg-blue-100 dark:bg-blue-900"
                          : ""
                      }
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading && <div>جاري التحميل...</div>}
          {error && <div>حدث خطأ أثناء جلب المنتجات</div>}
          <ProductsList products={filteredProducts} />
        </section>
      </div>

      {/* Mobile filter modal - موبايل فقط */}
      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50 p-4"
      >
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-sm text-sm relative">
          <button
            onClick={() => setFilterOpen(false)}
            className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="إغلاق الفلاتر"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <SlidersHorizontal size={20} />
            الفلاتر
          </h2>
          {/* التصنيف */}
          <div className="mb-6">
            <label className="font-semibold block mb-1">التصنيف</label>
            <select
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {/* المتجر */}
          <div className="mb-6">
            <label className="font-semibold block mb-1">المتجر</label>
            <select
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              {brands.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {/* السعر */}
          <div className="space-y-4 mb-6">
            <h3 className="font-medium">نطاق السعر</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={10000}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-1/2 rounded border px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="الأدنى"
              />
              <span>-</span>
              <input
                type="number"
                min={minPrice}
                max={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-1/2 rounded border px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="الأعلى"
              />
              <span className="text-xs text-gray-500">₪</span>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
