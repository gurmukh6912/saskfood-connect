"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, DollarSign, Users } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: "preparing" | "ready" | "in-transit" | "delivered";
}

export default function RestaurantPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customer: "John Doe",
      items: ["Spaghetti Carbonara", "Garlic Bread"],
      total: 28.50,
      status: "preparing"
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      items: ["Margherita Pizza", "Caesar Salad"],
      total: 32.25,
      status: "ready"
    }
  ]);

  const mockStats = {
    orders: 124,
    revenue: 3250.75,
    customers: 89
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, action: "mark_ready" }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status } : order
        ));

        toast({
          title: "Order Updated",
          description: data.message,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                Orders Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockStats.orders}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${mockStats.revenue.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-500" />
                Customers Served
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockStats.customers}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Current Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            {orders.filter(order => order.status !== "delivered").map((order) => (
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
                      <p className="font-semibold">{order.customer}</p>
                      <p className="text-sm text-gray-600">
                        {order.items.join(", ")}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">
                        Total: ${order.total.toFixed(2)}
                      </p>
                      {order.status === "preparing" && (
                        <Button 
                          onClick={() => updateOrderStatus(order.id, "ready")}
                        >
                          Mark as Ready
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button variant="outline">
                          Ready for Pickup
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed">
            {orders.filter(order => order.status === "delivered").length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No completed orders for today</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.filter(order => order.status === "delivered").map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Order {order.id}</CardTitle>
                        <Badge variant="default">Delivered</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold">{order.customer}</p>
                          <p className="text-sm text-gray-600">
                            {order.items.join(", ")}
                          </p>
                        </div>
                        <p className="font-semibold">
                          Total: ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}