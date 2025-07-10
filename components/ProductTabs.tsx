import { useState, useEffect } from "react";
import type { Product } from "@/lib/type";
import { supabase } from "@/lib/supabase";

type Specification = {
  category: string;
  features: string[];
};

interface ProductTabsProps {
  productId: string;
  description: string;
  specifications?: Product["specifications"];
  reviewsCount?: number;
}

export default function ProductTabs({
  productId,
  description,
  specifications,
  reviewsCount = 0,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews"
  >("description");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productSpecs, setProductSpecs] = useState<
    Product["specifications"] | null
  >(null);

  // جلب المواصفات الحقيقية من جدول المنتجات
  useEffect(() => {
    if (activeTab !== "specifications") return;
    if (specifications) {
      setProductSpecs(specifications);
      return;
    }
    supabase
      .from("products")
      .select("specifications")
      .eq("id", productId)
      .single()
      .then(({ data }) => {
        setProductSpecs(data?.specifications ?? null);
      });
  }, [activeTab, productId, specifications]);

  // جلب المراجعات الحقيقية من قاعدة البيانات
  useEffect(() => {
    if (activeTab !== "reviews") return;
    setLoading(true);
    supabase
      .from("reviews")
      .select("*", { count: "exact" })
      .eq("product_id", productId)
      .then(({ data }) => {
        setReviews(data || []);
        setLoading(false);
      });
  }, [activeTab, productId]);

  // تحويل المواصفات من object إلى array للعرض
  let specsArray: { category: string; features: string[] }[] = [];
  if (
    productSpecs &&
    typeof productSpecs === "object" &&
    !Array.isArray(productSpecs)
  ) {
    specsArray = Object.entries(productSpecs).map(([category, features]) => ({
      category,
      features: Array.isArray(features) ? features : [String(features)],
    }));
  } else if (Array.isArray(productSpecs)) {
    specsArray = productSpecs as any;
  }

  return (
    <div className="mb-12">
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "description"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "specifications"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "reviews"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Reviews ({reviewsCount})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "description" && (
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>
      )}

      {activeTab === "specifications" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {specsArray && specsArray.length > 0 ? (
            <table className="w-full">
              <tbody>
                {specsArray.map((spec, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900/50" : ""
                    }
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 w-1/4 align-top">
                      {spec.category}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      <ul className="space-y-2">
                        {spec.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">
                              •
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-gray-500 dark:text-gray-400 text-center">
              No specifications available.
            </div>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No reviews yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {review.customer_id}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-yellow-500 mb-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
