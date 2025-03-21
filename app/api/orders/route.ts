import { NextResponse } from "next/server";

const mockOrders = [
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
    status: "in-transit",
    total: 22.75,
    deliveryAddress: "456 Oak Ave, Regina"
  }
];

export async function GET() {
  return NextResponse.json(mockOrders);
}

export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json({ 
    message: "Order created successfully",
    orderId: `ORD-${Math.floor(Math.random() * 1000)}`
  });
}