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
        // Fetch offers - try complex query first
        let offersData: any[] | null = null;
        let offersError: any = null;
        
        try {
          // Fetch homepage offers
          const { data, error } = await supabase
            .from("homepage_offers")
            .select(`
              id,
              title,
              homepage_offer_products (
                id,
                offer_id,
                product_id
              )
            `)
            .order("id", { ascending: false })
            .limit(10);
          
          if (error) {
            console.error("Error fetching offers:", error);
            offersError = error;
            offersData = [];
          } else {
            console.log("Fetched offers:", data);
            console.log("Number of offers:", data?.length || 0);
            if (data && data.length > 0) {
              console.log("First offer details:", data[0]);
              console.log("All offers:", data);
            }
            offersData = data;
            offersError = null;
          }
        } catch (queryError) {
          console.error("Query failed:", queryError);
          offersError = queryError as any;
          offersData = [];
        }

        if (offersError) {
          console.error("Error fetching offers:", JSON.stringify(offersError, null, 2));
          console.error("Error details:", {
            message: offersError.message,
            details: offersError.details,
            hint: offersError.hint,
            code: offersError.code
          });
          setHomepageOffers([]);
        } else {
          console.log("Successfully fetched offers:", offersData);
          console.log("Number of offers found:", offersData?.length || 0);
          if (offersData && offersData.length > 0) {
            console.log("First offer:", offersData[0]);
            console.log("All offers:", offersData);
          }
          setHomepageOffers(offersData || []);
        }

        // Set default title since homepage_sections table doesn't exist
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
