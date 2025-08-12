"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "../components/hero-section";
import BrandList from "../components/BrandList";
import { GiftSection } from "../components/gift-section";
import { PopularShops } from "../components/popular-shops";
import CategoryMenu from "../components/CategoryMenu";
import MainProductSection from "../components/MainProductSection";
import { supabase } from "@/lib/supabase";
import type { Offer } from "@/lib/type";

export default function Home() {
  const [homepage_offers, setHomepageOffers] = useState<Offer[]>([]);
  const [defaultTitle, setDefaultTitle] = useState("منتجات مميزة");
  const [loading, setLoading] = useState(true);

  // Fetch offers and default title from database
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // First, fetch all offers
        const { data: offers, error: offersError } = await supabase
          .from("homepage_offers")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (offersError) {
          console.error("Error fetching offers:", offersError);
          setHomepageOffers([]);
        } else {
          console.log("Successfully fetched offers:", offers);
          console.log("Number of offers found:", offers?.length || 0);
          
          if (!offers || offers.length === 0) {
            console.log("No offers found in database");
            setHomepageOffers([]);
            return;
          }
          
          // For each offer, fetch its products (IDs only)
          const offersWithProducts = await Promise.all(
            (offers || []).map(async (offer) => {
              const { data: offerProducts, error: productError } = await supabase
                .from("homepage_offer_products")
                .select(`
                  id,
                  offer_id,
                  product_id
                `)
                .eq("offer_id", offer.id);

              if (productError) {
                console.error(`Error fetching products for offer ${offer.id}:`, productError);
              }

              return {
                ...offer,
                homepage_offer_products: offerProducts || []
              };
            })
          );
          
          console.log("Offers with products:", offersWithProducts);
          
          // Filter out offers that have no related products
          const validOffers = offersWithProducts.filter(offer => 
            offer.homepage_offer_products && 
            offer.homepage_offer_products.length > 0
          );
          
          console.log("Valid offers with products:", validOffers);
          console.log("Number of valid offers:", validOffers.length);
          setHomepageOffers(validOffers);
        }

        // Set default title
        setDefaultTitle("منتجات مميزة");

      } catch (error) {
        console.error("Error fetching data:", error);
        setHomepageOffers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="flex flex-col md:flex-row gap-4 sm:p-2 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* القسم الرئيسي */}
      <section className="flex-1 flex flex-col gap-4">
        <HeroSection />
        {/* قائمة التصنيفات في الموبايل - تحت الهيرو */}
        <div className="block md:hidden mb-4">
          <BrandList />
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري تحميل العروض...</p>
          </div>
        ) : (
          <>
            {/* Debug info when no offers */}
            {homepage_offers.length === 0 && (
              <div className="text-center py-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  لا توجد عروض متاحة
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  تحقق من قاعدة البيانات أو أضف عروض جديدة
                </p>
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-yellow-600 dark:text-yellow-400 text-sm">
                    معلومات التصحيح
                  </summary>
                  <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 bg-white dark:bg-gray-800 p-3 rounded">
                    <p>• تأكد من وجود بيانات في جدول homepage_offers</p>
                    <p>• تأكد من وجود بيانات في جدول homepage_offer_products</p>
                    <p>• تأكد من وجود منتجات نشطة في جدول products</p>
                    <p>• تحقق من سياسات RLS في Supabase</p>
                  </div>
                </details>
              </div>
            )}
            
            {/* Display each offer as a separate section */}
            {homepage_offers.length > 0 ? (
              homepage_offers.map((offer: Offer, index: number) => (
                <section key={offer.id} className="py-6 px-2">
                  {/* Offer Title Banner */}
                  <div className="relative mb-6 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg h-12 flex items-center justify-center">
                    <h2 className="text-xl sm:text-3xl font-extrabold text-white text-center">
                      {offer.title}
                    </h2>
                  </div>
                  
                  {/* Products for this offer */}
                  <MainProductSection
                    offer={offer}
                    linkToAll={`/products?offer=${offer.id}`}
                  />
                </section>
              ))
            ) : (
              <MainProductSection
                title={defaultTitle}
                linkToAll="/products"
              />
            )}
          </>
        )}
        <PopularShops />
        <GiftSection />
      </section>
      
      {/* الشريط الجانبي في الديسكتوب */}
      <aside className="hidden md:flex flex-col gap-6 md:w-56 lg:w-64 shrink-0 md:mt-0 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
        <CategoryMenu />
        <BrandList />
      </aside>
    </main>
  );
}
