"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/types/order";
import { Clock, MapPin } from "lucide-react";

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
    status: "delivering",
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
      { status: "preparing", timestamp: new Date().toISOString() },
      { status: "driver_assigned", timestamp: new Date().toISOString() },
      { status: "delivering", timestamp: new Date().toISOString() }
    ]
  }
];

function getStatusColor(status: Order['status']) {
  switch (status) {
    case 'delivered':
      return 'text-green-500';
    case 'cancelled':
      return 'text-red-500';
    default:
      return 'text-blue-500';
  }
}

function formatStatus(status: Order['status']) {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="past">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{order.restaurantName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Order #{order.id} • ${order.total.toFixed(2)}
                  </p>
                </div>
                <span className={`font-medium ${getStatusColor(order.status)}`}>
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{order.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Clock className="h-4 w-4" />
                    <span>Estimated delivery: 30-40 min</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Order Status Updates</h4>
                  <div className="space-y-2">
                    {order.statusHistory.map((status, index) => (
                      <div key={index} className="text-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>{formatStatus(status.status)}</span>
                        <span className="text-muted-foreground">
                          {new Date(status.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {/* Past orders would be similar but with completed/cancelled status */}
          <Card className="p-4 text-center text-muted-foreground">
            No past orders
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}