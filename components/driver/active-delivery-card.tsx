"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Order } from "@/types/order";
import { 
  Package, 
  Navigation,
  CheckCircle2,
  Clock,
  MapPin
} from "lucide-react";

interface ActiveDeliveryCardProps {
  delivery: Order;
  onStatusUpdate: (orderId: string, status: Order['status'], note?: string) => void;
}

export function ActiveDeliveryCard({ delivery, onStatusUpdate }: ActiveDeliveryCardProps) {
  const getStatusActions = () => {
    switch (delivery.status) {
      case "driver_assigned":
        return (
          <Button 
            className="w-full"
            onClick={() => onStatusUpdate(delivery.id, "driver_pickup")}
          >
            <Package className="mr-2 h-4 w-4" />
            Confirm Pickup
          </Button>
        );
      case "driver_pickup":
        return (
          <Button 
            className="w-full"
            onClick={() => onStatusUpdate(delivery.id, "delivering")}
          >
            <Navigation className="mr-2 h-4 w-4" />
            Start Delivery
          </Button>
        );
      case "delivering":
        return (
          <Button 
            className="w-full"
            onClick={() => onStatusUpdate(delivery.id, "delivered")}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete Delivery
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-semibold">{delivery.restaurantName}</h3>
          <p className="text-sm text-muted-foreground">
            Order #{delivery.id} • ${delivery.total.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {delivery.estimatedDeliveryTime || "30-40 min"}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>Pickup: {delivery.restaurantName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>Deliver to: {delivery.customerAddress}</span>
        </div>
      </div>

      {getStatusActions()}
    </Card>
  );
}