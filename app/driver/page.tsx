"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Truck, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  restaurant: string;
  items: string[];
  status: "preparing" | "ready" | "in-transit" | "delivered";
  total: number;
  deliveryAddress: string;
}

interface DriverStats {
  activeDeliveries: number;
  totalEarnings: number;
  deliveriesCompleted: number;
  rating: number;
}

export default function DriverPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      restaurant: "Prairie Pasta House",
      items: ["Spaghetti Carbonara", "Garlic Bread"],
      status: "preparing",
      total: 28.50,
      deliveryAddress: "123 Main St, Saskatoon"
    },
    {
      id: "ORD-002",
      restaurant: "Saskatoon Smokehouse",
      items: ["Pulled Pork Sandwich", "Coleslaw"],
      status: "ready",
      total: 22.75,
      deliveryAddress: "456 Oak Ave, Regina"
    }
  ]);

  const [stats, setStats] = useState<DriverStats>({
    activeDeliveries: 2,
    totalEarnings: 158.75,
    deliveriesCompleted: 12,
    rating: 4.8
  });

  const acceptDelivery = async (orderId: string) => {
    try {
      // const response = await fetch(`/api/orders/${orderId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ 
      //     status: "in-transit",
      //     action: "accept_delivery"
      //   }),
      // });

      // const data = await response.json();

      let data = {
        success: true,
        message: "Delivery accepted successfully",
      }

      if (data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: "in-transit" } : order
        ));
        setStats(prev => ({
          ...prev,
          activeDeliveries: prev.activeDeliveries + 1
        }));

        toast({
          title: "Delivery Accepted",
          description: data.message,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept delivery",
        variant: "destructive",
      });
    }
  };

  const completeDelivery = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: "delivered",
          action: "complete_delivery"
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: "delivered" } : order
        ));
        setStats(prev => ({
          ...prev,
          activeDeliveries: prev.activeDeliveries - 1,
          deliveriesCompleted: prev.deliveriesCompleted + 1,
          totalEarnings: prev.totalEarnings + 15 // Example delivery fee
        }));

      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete delivery",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screenbg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-muted-foreground">
                <Truck className="h-4 w-4 mr-1" />
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.activeDeliveries}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-1" />
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-muted-foreground">
                <Package className="h-4 w-4 mr-1" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.deliveriesCompleted}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-muted-foreground">
                <Star className="h-4 w-4 mr-1" />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.rating}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {orders
            .filter(order => order.status !== "delivered")
            .map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Order {order.id}</CardTitle>
                    <Badge variant={order.status === "preparing" ? "secondary" : "default"}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{order.restaurant}</h3>
                      <div className="text-sm text-gray-600">
                        {order.items.join(", ")}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 text-gray-600">
                      <MapPin className="h-5 w-5 mt-0.5" />
                      <span>{order.deliveryAddress}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        <span className="font-semibold">${order.total.toFixed(2)}</span>
                      </div>
                      {order.status === "ready" && (
                        <Button onClick={() => acceptDelivery(order.id)}>
                          Accept Delivery
                        </Button>
                      )}
                      {order.status === "in-transit" && (
                        <Button onClick={() => completeDelivery(order.id)}>
                          Complete Delivery
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}