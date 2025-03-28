"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MapPin, Navigation, Package, Clock } from "lucide-react";
import { useState } from "react";
import { DeliveryRequestDialog } from "@/components/driver/delivery-request-dialog";
import { ActiveDeliveryCard } from "@/components/driver/active-delivery-card";
import { Order, DeliveryBid } from "@/types/order";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const mockOrders: Order[] = [
  {
    id: "1",
    customerId: "c1",
    restaurantId: "r1",
    items: [
      { id: "i1", name: "Butter Chicken", quantity: 2, price: 18.99 },
      { id: "i2", name: "Naan", quantity: 1, price: 3.99 }
    ],
    status: "ready_for_pickup",
    subtotal: 41.97,
    deliveryFee: 4.99,
    tax: 2.10,
    total: 49.06,
    customerAddress: "123 Main St, Saskatoon",
    restaurantName: "Spicy Delight",
    createdAt: new Date().toISOString(),
    statusHistory: [
      { status: "pending", timestamp: new Date().toISOString() },
      { status: "accepted", timestamp: new Date().toISOString() },
      { status: "ready_for_pickup", timestamp: new Date().toISOString() }
    ]
  }
];

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeDeliveries, setActiveDeliveries] = useState<Order[]>([]);
  const [deliveryHistory, setDeliveryHistory] = useState<Order[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBidSubmit = (orderId: string, bid: DeliveryBid) => {
    console.log("Bid submitted:", bid);
    setIsDialogOpen(false);
  };

  const updateDeliveryStatus = (orderId: string, newStatus: Order['status'], note?: string) => {
    setActiveDeliveries(prevDeliveries => 
      prevDeliveries.map(delivery => 
        delivery.id === orderId
          ? {
              ...delivery,
              status: newStatus,
              statusHistory: [
                ...delivery.statusHistory,
                { status: newStatus, timestamp: new Date().toISOString(), note }
              ]
            }
          : delivery
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Driver Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className={`text-sm ${isOnline ? 'text-green-500' : 'text-muted-foreground'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <Switch
            checked={isOnline}
            onCheckedChange={setIsOnline}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$120.00</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Completed today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Online</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5</div>
            <p className="text-xs text-muted-foreground">Hours today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Zone</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Downtown</div>
            <p className="text-xs text-muted-foreground">Saskatoon</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Orders</TabsTrigger>
          <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          {!isOnline ? (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                Go online to see available orders
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{order.restaurantName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} items • ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-green-500 font-medium">$12.50 delivery fee</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{order.customerAddress}</span>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDialogOpen(true);
                    }}
                  >
                    Bid for Delivery
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-4">
            {activeDeliveries.map((delivery) => (
              <ActiveDeliveryCard
                key={delivery.id}
                delivery={delivery}
                onStatusUpdate={updateDeliveryStatus}
              />
            ))}
            {activeDeliveries.length === 0 && (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  No active deliveries
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {deliveryHistory.map((delivery) => (
              <Card key={delivery.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{delivery.restaurantName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Delivered • ${delivery.total.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(delivery.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
            {deliveryHistory.length === 0 && (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  No delivery history
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <DeliveryRequestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={selectedOrder}
        onSubmit={handleBidSubmit}
      />
    </div>
  );
}