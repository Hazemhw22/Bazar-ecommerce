"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  Bell,
  ShoppingBag as BagIcon,
  X,
  Home,
  List,
  Heart,
  Store,
  Phone,
} from "lucide-react";
import { useCart } from "./cart-provider";
import { MobileNav } from "./mobile-nav";
import Image from "next/image";
import { LanguageSelector } from "./language-select";
import ThemeToggle from "./theme-toggle";
import { useOnClickOutside } from "../hooks/use-click-outside";
import { CartSidebar } from "./cart-sidebar";
import CategoryMenu from "./CategoryMenu";

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { totalItems, totalPrice } = useCart();

  // Close search when clicking outside
  useOnClickOutside(searchRef, () => setSearchOpen(false));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleCartToggle = () => {
    setCartOpen(true);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="w-full border-b bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40">
        {/* Top bar - Only visible on desktop */}
        <div className="bg-gray-100 dark:bg-gray-800 text-sm py-2 border-b border-gray-200 dark:border-gray-700 hidden md:block">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-blue-600 dark:text-blue-400">📍</span>
              Arad, Israel
            </span>

            <div className="flex items-center gap-3">
              {/* Desktop Theme Toggle */}
              {mounted && <ThemeToggle />}

              {/* Language Selector */}
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          {/* فقط للموبايل */}
          <div className="w-full flex md:hidden items-center justify-between gap-2">
            {/* الموقع - يسار */}
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              <span className="text-blue-600 dark:text-blue-400">📍</span>
              Arad, Israel
            </span>
            {/* حقل البحث - وسط */}
            <div className="flex-1 mx-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن منتج أو قسم..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pr-10 pl-3 text-base shadow-sm focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-400 transition-all text-right"
                />
                <Search
                  size={18}
                  className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* الأيقونات - يمين */}
            <div className="flex items-center gap-2">
              {mounted && <ThemeToggle />}
              <LanguageSelector />
            </div>
          </div>

          {/* باقي الهيدر للديسكتوب */}
          <div className="hidden md:flex items-center gap-8 w-full">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <Image src="/LOGO%20KLIKMART.png" alt="KlikMart" width={240} height={80} className="hidden md:block h-16 w-auto" priority />

              {/* Navigation - Desktop only */}
              <nav className="hidden md:flex gap-6 text-sm font-medium">
                <Link
                  href="/"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group flex items-center gap-1"
                >
                  <Home size={18} />
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/categories"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group flex items-center gap-1"
                >
                  <List size={18} />
                  Categories
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/favourite"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group flex items-center gap-1"
                >
                  <Heart size={18} />
                  Favourite
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/shops"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group flex items-center gap-1"
                >
                  <Store size={18} />
                  Shops
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/products"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group flex items-center gap-1"
                >
                  <BagIcon size={18} />
                  Products
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group flex items-center gap-1"
                >
                  <Phone size={18} />
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full"></span>
                </Link>
              </nav>
            </div>

            {/* Right: Icons (Desktop only) */}
            <div className="flex items-center gap-3 md:ml-auto">
              {/* Desktop Search with side dropdown */}
              <div
                ref={searchRef}
                className="relative hidden md:flex items-center transition-all duration-300"
                style={{ width: searchOpen ? 240 : 40 }}
              >
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setSearchOpen((v) => !v)}
                  aria-label="بحث"
                  type="button"
                  tabIndex={0}
                  style={{ pointerEvents: searchOpen ? "none" : "auto" }} // يمنع تكرار الفتح عند الفتح
                >
                  <Search className="w-5 h-5" />
                </button>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  className={`
                    pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm outline-none w-full
                    transition-opacity duration-300
                    ${
                      searchOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }
                    text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                  `}
                  style={{ transition: "opacity 0.3s" }}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onBlur={() => setSearchOpen(false)}
                  autoFocus={searchOpen}
                />
              </div>

              {/* User */}
              <Link
                href="/account"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="الحساب"
              >
                <User size={20} />
              </Link>

              {/* Notifications */}
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                aria-label="الإشعارات"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* Cart */}
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                onClick={handleCartToggle}
                aria-label="السلة"
              >
                <BagIcon size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-medium">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Padding below content so MobileNav doesn't cover it */}
      <div className="pb-1 md:pb-0"></div>
      {/* Mobile navigation menu - only shows on mobile */}
      <div className="md:hidden">
        <MobileNav onCartToggle={handleCartToggle} />
      </div>

      {/* Cart Sidebar - Works for both desktop and mobile */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile Categories Bar */}
      <div className="w-full md:hidden ">
        <CategoryMenu />
      </div>

      {/* Mobile Logo, Name, Slogan, and Socials */}
      <div className="w-full md:hidden flex flex-row mt-2 gap-6 px-4">
        {/* الشعار والنص */}
        <div className="flex flex-col items-center text-center flex-1 -translate-x-5 w-full">
          {/* Logo */}
          <Image src="/LOGO%20KLIKMART.png" alt="KlikMart" width={380} height={130} className="mb-0 h-32 w-auto" priority />

          {/* نص أصغر وتباعد أكبر */}
          <span className="text-base font-semibold text-gray-800 dark:text-gray-200 ">
            تسوق الآن مع عالمنا الواسع
          </span>
        </div>
      </div>
    </>
  );
}
