"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Building2,
  Banknote,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { useOrders } from "@/components/order-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@/lib/type";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  shippingMethod: string;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  sameAsShipping: boolean;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "IL",
    phone: "",
    shippingMethod: "standard",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    sameAsShipping: true,
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
  });

  const subtotal = totalPrice;
  const shippingCost =
    formData.shippingMethod === "express"
      ? 15
      : formData.shippingMethod === "overnight"
      ? 25
      : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const orderId = `ORD-${Date.now()}`;
    const currentDate = new Date();
    const orderData = {
      id: orderId,
      customer_id: "user-1", // يمكنك ربطه بالمستخدم الحالي إذا كان متوفرًا
      status: OrderStatus.PENDING,
      total_amount: total,
      shipping_address: {
        full_name: formData.firstName + " " + formData.lastName,
        address_line1: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.zipCode,
        country: formData.country,
        phone_number: formData.phone,
      },
      billing_address: {
        full_name: formData.firstName + " " + formData.lastName,
        address_line1: formData.billingAddress || formData.address,
        city: formData.billingCity || formData.city,
        state: formData.billingState || formData.state,
        postal_code: formData.billingZipCode || formData.zipCode,
        country: formData.country,
        phone_number: formData.phone,
      },
      payment_method: formData.paymentMethod as PaymentMethod,
      payment_status: PaymentStatus.PENDING,
      created_at: currentDate.toISOString(),
      updated_at: currentDate.toISOString(),
      tracking_number: "",
      notes: "",
    };
    addOrder(orderData);
    clearCart();
    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/cart">
            <Button>Go to Cart</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="mb-4 lg:mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Cart
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="space-y-4 lg:space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin size={20} />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+972-50-123-4567"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="123 Main Street"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">
                      City
                    </Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) =>
                        handleInputChange("city", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Jerusalem">Jerusalem</SelectItem>
                        <SelectItem value="Tel Aviv">Tel Aviv</SelectItem>
                        <SelectItem value="Haifa">Haifa</SelectItem>
                        <SelectItem value="Rishon LeZion">
                          Rishon LeZion
                        </SelectItem>
                        <SelectItem value="Petah Tikva">Petah Tikva</SelectItem>
                        <SelectItem value="Ashdod">Ashdod</SelectItem>
                        <SelectItem value="Netanya">Netanya</SelectItem>
                        <SelectItem value="Beer Sheva">Beer Sheva</SelectItem>
                        <SelectItem value="Bnei Brak">Bnei Brak</SelectItem>
                        <SelectItem value="Holon">Holon</SelectItem>
                        <SelectItem value="Ramat Gan">Ramat Gan</SelectItem>
                        <SelectItem value="Ashkelon">Ashkelon</SelectItem>
                        <SelectItem value="Rehovot">Rehovot</SelectItem>
                        <SelectItem value="Bat Yam">Bat Yam</SelectItem>
                        <SelectItem value="Beit Shemesh">
                          Beit Shemesh
                        </SelectItem>
                        <SelectItem value="Kfar Saba">Kfar Saba</SelectItem>
                        <SelectItem value="Herzliya">Herzliya</SelectItem>
                        <SelectItem value="Hadera">Hadera</SelectItem>
                        <SelectItem value="Modi'in">Modi'in</SelectItem>
                        <SelectItem value="Nazareth">Nazareth</SelectItem>
                        <SelectItem value="Lod">Lod</SelectItem>
                        <SelectItem value="Ramla">Ramla</SelectItem>
                        <SelectItem value="Arad">Arad</SelectItem>
                        <SelectItem value="Eilat">Eilat</SelectItem>
                        <SelectItem value="Tiberias">Tiberias</SelectItem>
                        <SelectItem value="Acre">Acre</SelectItem>
                        <SelectItem value="Kiryat Gat">Kiryat Gat</SelectItem>
                        <SelectItem value="Dimona">Dimona</SelectItem>
                        <SelectItem value="Safed">Safed</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium">
                      District
                    </Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        handleInputChange("state", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Jerusalem">
                          Jerusalem District
                        </SelectItem>
                        <SelectItem value="Northern">
                          Northern District
                        </SelectItem>
                        <SelectItem value="Haifa">Haifa District</SelectItem>
                        <SelectItem value="Central">
                          Central District
                        </SelectItem>
                        <SelectItem value="Tel Aviv">
                          Tel Aviv District
                        </SelectItem>
                        <SelectItem value="Southern">
                          Southern District
                        </SelectItem>
                        <SelectItem value="Judea and Samaria">
                          Judea and Samaria
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="zipCode" className="text-sm font-medium">
                    ZIP Code
                  </Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    placeholder="12345"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck size={20} />
                  Shipping Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.shippingMethod}
                  onValueChange={(value) =>
                    handleInputChange("shippingMethod", value)
                  }
                  className="space-y-3"
                >
                  <div
                    className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      formData.shippingMethod === "standard"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <p className="font-medium">Standard Shipping</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            5-7 business days
                          </p>
                        </div>
                        <span className="font-medium mt-1 sm:mt-0">$10.00</span>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      formData.shippingMethod === "express"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <p className="font-medium">Express Shipping</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            2-3 business days
                          </p>
                        </div>
                        <span className="font-medium mt-1 sm:mt-0">$15.00</span>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      formData.shippingMethod === "overnight"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <RadioGroupItem value="overnight" id="overnight" />
                    <Label
                      htmlFor="overnight"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <p className="font-medium">Overnight Shipping</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Next business day
                          </p>
                        </div>
                        <span className="font-medium mt-1 sm:mt-0">$25.00</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard size={20} />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    handleInputChange("paymentMethod", value)
                  }
                  className="space-y-3"
                >
                  {/* Credit/Debit Card */}
                  <div
                    className={`flex flex-col border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      formData.paymentMethod === "card"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3 p-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <CreditCard size={18} />
                        Credit/Debit Card
                      </Label>
                    </div>
                    {formData.paymentMethod === "card" && (
                      <div className="space-y-4 px-4 pb-4">
                        <h4 className="font-medium text-sm">
                          Card Information
                        </h4>
                        <div>
                          <Label
                            htmlFor="cardName"
                            className="text-sm font-medium"
                          >
                            Name on Card
                          </Label>
                          <Input
                            id="cardName"
                            value={formData.cardName}
                            onChange={(e) =>
                              handleInputChange("cardName", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="cardNumber"
                            className="text-sm font-medium"
                          >
                            Card Number
                          </Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) =>
                              handleInputChange("cardNumber", e.target.value)
                            }
                            placeholder="1234 5678 9012 3456"
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="expiryDate"
                              className="text-sm font-medium"
                            >
                              Expiry Date
                            </Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) =>
                                handleInputChange("expiryDate", e.target.value)
                              }
                              placeholder="MM/YY"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="cvv"
                              className="text-sm font-medium"
                            >
                              CVV
                            </Label>
                            <Input
                              id="cvv"
                              value={formData.cvv}
                              onChange={(e) =>
                                handleInputChange("cvv", e.target.value)
                              }
                              placeholder="123"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bank Transfer */}
                  <div
                    className={`flex flex-col border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      formData.paymentMethod === "bank"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3 p-3">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label
                        htmlFor="bank"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Banknote size={18} />
                        Bank Transfer
                      </Label>
                    </div>
                    {formData.paymentMethod === "bank" && (
                      <div className="space-y-4 px-4 pb-4">
                        <div className="flex items-center gap-2">
                          <Banknote size={20} className="text-blue-600" />
                          <h4 className="font-medium text-sm">
                            Bank Transfer Instructions
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Bank transfer details will be provided after order
                          confirmation. You will receive an email with complete
                          banking information and payment instructions.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pay In-Store */}
                  <div
                    className={`flex flex-col border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      formData.paymentMethod === "instore"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3 p-3">
                      <RadioGroupItem value="instore" id="instore" />
                      <Label
                        htmlFor="instore"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Building2 size={18} />
                        Pay In-Store
                      </Label>
                    </div>
                    {formData.paymentMethod === "instore" && (
                      <div className="space-y-4 px-4 pb-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={20} className="text-green-600" />
                          <h4 className="font-medium text-sm">
                            Store Location
                          </h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">Main Store Location:</p>
                          <div className="text-gray-600 dark:text-gray-400">
                            <p>123 Commerce Street</p>
                            <p>Arad, Israel 8920435</p>
                            <p>Phone: +972-8-123-4567</p>
                          </div>
                          <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              <strong>Store Hours:</strong>
                              <br />
                              Sunday - Thursday: 9:00 AM - 8:00 PM
                              <br />
                              Friday: 9:00 AM - 2:00 PM
                              <br />
                              Saturday: Closed
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Please bring your order confirmation and a valid ID
                            when visiting the store.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PayPal */}
                  <div
                    className={`flex flex-col border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      formData.paymentMethod === "paypal"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3 p-3">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label
                        htmlFor="paypal"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span className="text-blue-600 font-bold">PayPal</span>
                      </Label>
                    </div>
                    {formData.paymentMethod === "paypal" && (
                      <div className="space-y-4 px-4 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-bold">
                            PayPal
                          </span>
                          <h4 className="font-medium text-sm">
                            PayPal Payment
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          You will be redirected to PayPal to complete your
                          purchase securely.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    className={`flex flex-col border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      formData.paymentMethod === "cod"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3 p-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label
                        htmlFor="cod"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Banknote size={18} />
                        Cash on Delivery
                      </Label>
                    </div>
                    {formData.paymentMethod === "cod" && (
                      <div className="space-y-4 px-4 pb-4">
                        <div className="flex items-center gap-2">
                          <Banknote size={20} className="text-green-600" />
                          <h4 className="font-medium text-sm">
                            Pay with cash upon delivery
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Please prepare the exact amount. Our courier will
                          collect the payment when your order is delivered.
                        </p>
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Mobile: Shows at bottom, Desktop: Shows on right */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items - Scrollable on mobile if many items */}
                <div className="space-y-3 max-h-64 lg:max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            item.image || "/placeholder.svg?height=64&width=64"
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base lg:text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
