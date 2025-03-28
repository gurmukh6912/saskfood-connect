"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Order, DeliveryBid } from "@/types/order";
import { useState } from "react";

interface DeliveryRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (orderId: string, bid: DeliveryBid) => void;
}

export function DeliveryRequestDialog({
  open,
  onOpenChange,
  order,
  onSubmit
}: DeliveryRequestDialogProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bid: DeliveryBid = {
      id: Math.random().toString(36).substr(2, 9),
      driverId: "d1", // This would come from auth
      orderId: order.id,
      amount: parseFloat(bidAmount),
      estimatedTime: parseInt(estimatedTime),
      status: "pending",
      createdAt: new Date().toISOString()
    };
    onSubmit(order.id, bid);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delivery Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">{order.restaurantName}</h3>
            <p className="text-sm text-muted-foreground">
              {order.items.length} items • ${order.total.toFixed(2)}
            </p>
            <p className="text-sm">
              Pickup: {order.restaurantName}<br />
              Delivery: {order.customerAddress}
            </p>
          </div>

          <div>
            <Label htmlFor="bidAmount">Your Bid ($)</Label>
            <Input
              id="bidAmount"
              type="number"
              step="0.01"
              min="0"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="estimatedTime">Estimated Delivery Time (minutes)</Label>
            <Input
              id="estimatedTime"
              type="number"
              min="1"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit">Submit Bid</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}