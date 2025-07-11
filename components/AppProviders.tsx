// app/app-providers.tsx أو wherever your AppProviders is located
"use client";

import type React from "react";
import ThemeProvider from "./theme-provider";
import { CartProvider } from "./cart-provider";
import { FavoritesProvider } from "./favourite-items";
import { SiteHeader } from "./site-header";
import SiteFooter from "./site-footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrderProvider } from "./order-provider";

const queryClient = new QueryClient();

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <FavoritesProvider>
            <OrderProvider>
              <div className="min-h-screen flex flex-col page-background">
                <SiteHeader />
                <main className="flex-1 pb-28 page-container max-w-7xl mx-auto w-full m-4 p-4 sm:p-6 lg:p-8">
                  {children}
                </main>
                <SiteFooter />
              </div>
            </OrderProvider>
          </FavoritesProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
