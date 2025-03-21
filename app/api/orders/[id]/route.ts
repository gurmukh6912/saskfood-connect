import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { status, action } = await request.json();
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let message = "";
  switch (action) {
    case "accept_delivery":
      message = `Delivery for order ${params.id} accepted`;
      break;
    case "mark_ready":
      message = `Order ${params.id} marked as ready for pickup`;
      break;
    case "complete_delivery":
      message = `Delivery for order ${params.id} completed`;
      break;
    default:
      message = `Order ${params.id} updated to ${status}`;
  }

  return NextResponse.json({
    success: true,
    message,
    status
  });
}