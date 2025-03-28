"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Restaurant } from "@/types/restaurant";
import { LocationDialog } from "@/components/customer/location-dialog";
import { RestaurantMenuDialog } from "@/components/customer/restaurant-menu-dialog";
import { useDebounce } from "@/hooks/use-debounce";

export default function CustomerDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState("Saskatoon");
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => {
        setRestaurants(data);
        setFilteredRestaurants(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = restaurants.filter(restaurant => {
      const searchLower = debouncedSearch.toLowerCase();
      return (
        restaurant.name.toLowerCase().includes(searchLower) ||
        restaurant.cuisine.toLowerCase().includes(searchLower)
      );
    });
    setFilteredRestaurants(filtered);
  }, [debouncedSearch, restaurants]);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setMenuDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for restaurants or cuisines"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="flex gap-2"
          onClick={() => setLocationDialogOpen(true)}
        >
          <MapPin className="h-5 w-5" />
          Deliver to: {deliveryLocation}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="h-[300px] animate-pulse bg-muted" />
          ))
        ) : (
          filteredRestaurants.map((restaurant) => (
            <Card 
              key={restaurant.id} 
              className="overflow-hidden group cursor-pointer"
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <div className="relative h-48">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">⭐ {restaurant.rating}</span>
                  <span className="text-sm">{restaurant.deliveryTime}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Min. order: ${restaurant.minOrder}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>

      <LocationDialog
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        onLocationSelect={setDeliveryLocation}
      />

      {selectedRestaurant && (
        <RestaurantMenuDialog
          open={menuDialogOpen}
          onOpenChange={setMenuDialogOpen}
          restaurant={selectedRestaurant}
        />
      )}
    </div>
  );
}