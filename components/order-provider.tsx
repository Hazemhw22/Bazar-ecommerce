"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Order, OrderItem } from "@/lib/type";

const OrderContext = createContext<
  | {
      orders: Order[];
      addOrder: (order: Order) => void;
      updateOrderStatus: (orderId: string, status: Order["status"]) => void;
      getOrderById: (orderId: string) => Order | undefined;
    }
  | undefined
>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("user-orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders([]); // لا داتا وهمية
        localStorage.setItem("user-orders", JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error loading orders from localStorage:", error);
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    try {
      localStorage.setItem("user-orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Error saving orders to localStorage:", error);
    }
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
