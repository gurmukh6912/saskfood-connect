"use client";

import { Card } from "@/components/ui/card";
import { Clock, Star, DollarSign } from "lucide-react";

interface RestaurantHeaderProps {
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  imageUrl: string;
}

export function RestaurantHeader({
  name,
  cuisine,
  rating,
  deliveryTime,
  minOrder,
  imageUrl
}: RestaurantHeaderProps) {
  return (
    <>
      <div className="h-64 relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container px-4 -mt-16 relative">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-2">{name}</h1>
          <p className="text-muted-foreground mb-4">{cuisine}</p>
          
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{rating} (500+ ratings)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>Min. order ${minOrder}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}