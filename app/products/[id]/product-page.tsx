"use client";

import type { Product } from "@/lib/type";
import { useCart } from "../../../components/cart-provider";
import { useFavorites } from "../../../components/favourite-items";
import { ImageLightbox } from "@/components/image-lightbox";
import ProductTabs from "@/components/ProductTabs";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Printer,
  Share2,
  Copy,
  MessageCircle,
} from "lucide-react";
import SuggestedProductsCarousel from "../../../components/SuggestedProductsCarousel";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type ProductDetailProps = {
  params: { id: string };
  product: Product;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem: addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites?.() ?? {
    isFavorite: () => false,
    toggleFavorite: () => {},
  };
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedProperties, setSelectedProperties] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (!product.category_id) return;
    supabase
      .from("products")
      .select("*")
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .limit(8)
      .then(({ data }) => setSimilarProducts(data || []));
  }, [product.category_id, product.id]);

  const handleShare = (type: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `شاهد هذا المنتج: ${product.name} - ₪${
      product.discount_price ?? product.price
    }`;
    switch (type) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        break;
      case "print":
        window.print();
        break;
      case "share":
        if (navigator.share) {
          navigator.share({ title: product.name, text, url });
        }
        break;
    }
  };

  // دالة لتغيير الخيار المختار
  const handleSelectProperty = (title: string, option: string) => {
    setSelectedProperties((prev) => ({ ...prev, [title]: option }));
  };

  // استخراج اسم المتجر واسم التصنيف من الحقول الديناميكية
  const shopName = product.shops?.name;
  const categoryName = product.categories?.name;

  if (!product)
    return <div className="p-6 text-red-500">المنتج غير موجود أو حدث خطأ.</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {/* صور المنتج */}
        <div>
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 h-96 flex items-center justify-center relative cursor-pointer group"
            onClick={() => setLightboxOpen(true)}
          >
            <div className="absolute top-3 left-3 z-10 flex gap-2">
              <button
                title="طباعة"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare("print");
                }}
                className="bg-white/80 dark:bg-gray-900/60 rounded-full p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
              >
                <Printer size={18} />
              </button>
              <button
                title="واتساب"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare("whatsapp");
                }}
                className="bg-white/80 dark:bg-gray-900/60 rounded-full p-2 hover:bg-green-100 dark:hover:bg-green-900/40 transition"
              >
                <MessageCircle size={18} />
              </button>
              <button
                title="نسخ الرابط"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare("copy");
                }}
                className="bg-white/80 dark:bg-gray-900/60 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800/40 transition"
              >
                <Copy size={18} />
              </button>
              <button
                title="مشاركة"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare("share");
                }}
                className="bg-white/80 dark:bg-gray-900/60 rounded-full p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
              >
                <Share2 size={18} />
              </button>
            </div>
            <ImageLightbox
              images={product.images ?? []}
              currentIndex={activeImage}
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              productName={product.name}
            />
            <img
              src={product.images?.[activeImage] ?? "/placeholder.svg"}
              alt={product.name}
              className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-105"
              style={{ maxHeight: 380 }}
            />
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
              اضغط لتكبير الصورة
            </span>
          </div>
          <div className="flex gap-2 justify-center">
            {(product.images ?? []).map((image, index) => (
              <button
                key={index}
                className={`border-2 rounded-lg overflow-hidden w-16 h-16 transition-all duration-200 ${
                  activeImage === index
                    ? "border-blue-600 scale-110 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`صورة ${index + 1}`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - صورة ${index + 1}`}
                  className="object-contain w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-6">
            {/* اسم المنتج */}
            <h1 className="text-4xl font-extrabold mb-2 text-gray-900 dark:text-white tracking-tight">
              {product.name}
            </h1>
            {/* تفاصيل أساسية */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {shopName && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                  {shopName}
                </span>
              )}
              {categoryName && (
                <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                  {categoryName}
                </span>
              )}
            </div>
            {/* السعر */}
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl font-bold text-primary">
                ₪{product.discount_price ?? product.price}
              </span>
              {product.discount_price &&
                product.discount_price !== product.price && (
                  <span className="text-gray-400 line-through text-xl">
                    ₪{product.price}
                  </span>
                )}
              {product.discount_price &&
                product.discount_price !== product.price && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    خصم
                  </span>
                )}
            </div>
            {/* وصف المنتج */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-base">
              {product.description}
            </p>

            {/* خصائص المنتج الديناميكية */}
            {product.properties && product.properties.length > 0 && (
              <div className="space-y-4 mb-6">
                {product.properties.map((prop) => (
                  <div key={prop.title}>
                    <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                      {prop.title}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {prop.options.map((option) => (
                        <button
                          key={option}
                          onClick={() =>
                            handleSelectProperty(prop.title, option)
                          }
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                            selectedProperties[prop.title] === option
                              ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full justify-center sm:justify-start mt-4">
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden w-max">
              <button
                className="h-12 w-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="إنقاص الكمية"
              >
                <Minus size={20} />
              </button>
              <div className="h-12 w-16 flex items-center justify-center font-semibold text-base select-none">
                {quantity}
              </div>
              <button
                className="h-12 w-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="زيادة الكمية"
              >
                <Plus size={20} />
              </button>
            </div>

            <Button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.discount_price ?? product.price,
                  image: product.images?.[0] ?? "",
                  quantity,
                })
              }
              className="h-12 w-16 sm:w-auto bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              aria-label="أضف إلى السلة"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="hidden sm:inline ml-2 text-base">
                أضف إلى السلة
              </span>
            </Button>

            <button
              className="h-12 w-16 sm:w-auto border border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center gap-2 px-0 sm:px-4"
              onClick={() =>
                toggleFavorite?.({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  discount_price: product.discount_price ?? product.price,
                  images: product.images ?? [],
                })
              }
              aria-label={
                isFavorite?.(product.id)
                  ? "إزالة من المفضلة"
                  : "إضافة إلى المفضلة"
              }
            >
              <Heart
                size={20}
                className={isFavorite?.(product.id) ? "text-red-500" : ""}
                fill={isFavorite?.(product.id) ? "currentColor" : "none"}
              />
              <span className="hidden sm:inline ml-2 text-base">
                {isFavorite?.(product.id)
                  ? "إزالة من المفضلة"
                  : "إضافة إلى المفضلة"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <ProductTabs
          productId={product.id}
          description={product.description ?? ""}
          specifications={
            Array.isArray(product.specifications)
              ? product.specifications
              : product.specifications
              ? [product.specifications]
              : []
          }
          reviewsCount={0}
        />
      </div>

      {similarProducts.length > 0 && (
        <div className="mt-20">
          {/* <SuggestedProductsCarousel
            product={similarProducts}
            title="منتجات مشابهة"
          /> */}
        </div>
      )}
    </div>
  );
}
