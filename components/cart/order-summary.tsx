"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  checkoutButton?: boolean;
}

export function OrderSummary({
  subtotal,
  deliveryFee,
  tax,
  total,
  checkoutButton = true
}: OrderSummaryProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      {checkoutButton && (
        <Link href="/customer/checkout">
          <Button className="w-full mt-6" size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      )}
    </Card>
  );
}