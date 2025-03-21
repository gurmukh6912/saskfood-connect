"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock } from "lucide-react";
import Link from "next/link";

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
}

export default function CustomerPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    fetch("/api/restaurants")
      .then((res) => res.json())
      .then(setRestaurants);
  }, []);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link href={`/customer/${restaurant.id}`} key={restaurant.id}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>{restaurant.name}</CardTitle>
                  <p className="text-gray-600">{restaurant.cuisine}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" />
                      <span>{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center text-foreground">
                      <Clock className="h-5 w-5 mr-1" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}