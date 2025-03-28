"use client";

import { useState } from "react";
import { AddressForm } from "@/components/checkout/address-form";
import { PaymentMethod } from "@/components/checkout/payment-method";
import { BlockchainPayment } from "@/components/checkout/blockchain-payment";
import { OrderSummary } from "@/components/cart/order-summary";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const router = useRouter();

  // These values would typically come from your cart state management
  const subtotal = 41.97;
  const deliveryFee = 4.99;
  const tax = 2.10;
  const total = subtotal + deliveryFee + tax;

  const handlePaymentComplete = () => {
    router.push("/customer/orders");
  };

  return (
    <div className="container px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-8">
          <AddressForm />
          <PaymentMethod
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />
          {paymentMethod === "crypto" ? (
            <BlockchainPayment
              amount={total}
              orderId="123" // This should come from your order creation
              onPaymentComplete={handlePaymentComplete}
            />
          ) : (
            <OrderSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              total={total}
              checkoutButton={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}