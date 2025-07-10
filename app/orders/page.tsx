"use client";

import { useOrders } from "@/components/order-provider";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function OrdersPage() {
  const { orders } = useOrders();
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders found.</div>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Placed on {order.created_at}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {order.status}
                </p>
                <p className="text-sm text-muted-foreground">
                  Payment: {order.payment_status}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-full md:w-1/4 relative h-[120px]">
                    <Image
                      src="/placeholder.svg"
                      alt="Product"
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded-md border"
                      priority
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {order.billing_address?.full_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {order.billing_address?.address_line1}
                    </p>
                    <p className="mt-2 font-medium">${order.total_amount}</p>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="w-full md:w-auto mt-4 md:mt-0">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                      {order.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
