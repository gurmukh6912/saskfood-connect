"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { MenuItem } from "@/types/restaurant";

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onRemove: (itemId: string) => void;
}

export function MenuItemCard({ item, quantity, onAdd, onRemove }: MenuItemCardProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold">${item.price.toFixed(2)}</span>
            <div className="flex items-center gap-2">
              {quantity > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRemove(item.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{quantity}</span>
                </>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => onAdd(item)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}