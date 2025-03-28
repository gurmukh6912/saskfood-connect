"use client";

import { useState } from "react";
import { CartItem as CartItemComponent } from "@/components/cart/cart-item";
import { OrderSummary } from "@/components/cart/order-summary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CartItem } from "@/types/cart";

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Butter Chicken",
      price: 18.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
      restaurant: "Spicy Delight",
      description: "",
      category: ""
    },
    {
      id: "2",
      name: "Garlic Naan",
      price: 3.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
      restaurant: "Spicy Delight",
      description: "",
      category: ""
    }
  ]);

  const updateQuantity = (itemId: string, change: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 4.99;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Add items from restaurants to get started</p>
          <Link href="/customer">
            <Button>Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>

        <OrderSummary
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          tax={tax}
          total={total}
        />
      </div>
    </div>
  );
}