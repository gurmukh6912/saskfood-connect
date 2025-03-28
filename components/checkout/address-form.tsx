"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddressForm() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="John" />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="(306) 555-0123" type="tel" />
        </div>
        <div>
          <Label htmlFor="address">Street Address</Label>
          <Input id="address" placeholder="123 Main St" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Saskatoon" />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input id="postalCode" placeholder="S7K 1A1" />
          </div>
        </div>
        <div>
          <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
          <Textarea
            id="instructions"
            placeholder="Apartment number, gate code, or other special instructions"
          />
        </div>
      </div>
    </Card>
  );
}