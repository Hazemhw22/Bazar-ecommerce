"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Category } from "@/lib/type";

const fallbackIcons = [
  "🏠",
  "🌿",
  "📱",
  "☕",
  "👕",
  "👜",
  "👟",
  "🛒",
  "🎁",
  "💡",
];

export default function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .then(({ data }) => {
        setCategories(data || []);
      });
  }, []);

  return (
    <>
      {/* موبايل - شريط أفقي داخل الهيدر أو تحته */}
      <div className="lg:hidden overflow-x-auto border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 px-4 py-2">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              className="flex flex-row-reverse items-center gap-1 text-sm whitespace-nowrap px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <span className="text-lg">
                {/* لا يوجد حقل icon في النوع الجديد، استخدم logo_url أو fallback */}
                {cat.logo_url ? (
                  <img
                    src={cat.logo_url}
                    alt={cat.name}
                    className="w-5 h-5 inline"
                  />
                ) : (
                  fallbackIcons[idx % fallbackIcons.length]
                )}
              </span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ديسكتوب - عمودي مثل BrandList */}
      <div className="hidden lg:flex flex-col gap-2">
        {categories.map((cat, idx) => (
          <button
            key={cat.id}
            className="flex flex-row-reverse items-center gap-2 text-sm px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-lg">
              {cat.logo_url ? (
                <img
                  src={cat.logo_url}
                  alt={cat.name}
                  className="w-5 h-5 inline"
                />
              ) : (
                fallbackIcons[idx % fallbackIcons.length]
              )}
            </span>
            <span className="text-left">{cat.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}
