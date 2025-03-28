"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Restaurant, MenuItem } from "@/types/restaurant";
import { MenuItemCard } from "@/components/restaurant/menu-item-card";
import { useState } from "react";
import { CartItem } from "@/types/cart";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

interface RestaurantMenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: Restaurant;
}

const mockMenuItems: MenuItem[] = [
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
  }
];

export function RestaurantMenuDialog({
  open,
  onOpenChange,
  restaurant
}: RestaurantMenuDialogProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1, restaurant: restaurant.name }];
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh]">
        <DialogHeader>
          <DialogTitle>{restaurant.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-4">
              {mockMenuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  quantity={getItemQuantity(item.id)}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </ScrollArea>

          {cartItems.length > 0 && (
            <div className="border-t mt-4 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  {totalItems} items
                </span>
                <span className="font-semibold">${totalAmount.toFixed(2)}</span>
              </div>
              <Link href="/customer/cart" onClick={() => onOpenChange(false)}>
                <Button className="w-full">View Cart</Button>
              </Link>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}