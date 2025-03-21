import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    activeDeliveries: 2,
    totalEarnings: 158.75,
    deliveriesCompleted: 12,
    rating: 4.8
  });
}

export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json({
    success: true,
    message: "Driver status updated successfully"
  });
}