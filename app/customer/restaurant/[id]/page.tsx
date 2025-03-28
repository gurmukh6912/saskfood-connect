"use client";

import { useState } from "react";
import { RestaurantHeader } from "@/components/restaurant/restaurant-header";
import { MenuItemCard } from "@/components/restaurant/menu-item-card";
import { MenuItem } from "@/types/restaurant";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Butter Chicken",
    description: "Creamy, aromatic curry with tender chicken pieces",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
    category: "Main Course"
  },
  {
    id: "2",
    name: "Garlic Naan",
    description: "Freshly baked flatbread with garlic and butter",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    category: "Bread"
  },
  {
    id: "3",
    name: "Biryani",
    description: "Aromatic rice dish with spices and vegetables",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
    category: "Main Course"
  }
];

interface CartItem extends MenuItem {
  quantity: number;
}

export default function RestaurantDetails() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === itemId);
      if (existingItem?.quantity === 1) {
        return prev.filter(i => i.id !== itemId);
      }
      return prev.map(i =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const getItemQuantity = (itemId: string) => {
    return cartItems.find(i => i.id === itemId)?.quantity || 0;
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="pb-20">
      <RestaurantHeader
        name="Spicy Delight"
        cuisine="Indian • Vegetarian Friendly"
        rating={4.5}
        deliveryTime="30-40 min"
        minOrder={20}
        imageUrl="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
      />

      <div className="container px-4">
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                quantity={getItemQuantity(item.id)}
                onAdd={addToCart}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {totalItems} items
              </span>
              <span className="font-semibold">${totalAmount.toFixed(2)}</span>
            </div>
            <Link href="/customer/cart">
              <Button className="w-full" size="lg">
                View Cart
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}