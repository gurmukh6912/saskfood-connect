import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: { menuItem: true },
        },
        restaurant: true,
        customer: {
          include: { profile: true },
        },
        delivery: {
          include: { driver: true },
        },
        statusHistory: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check authorization based on role
    const isAuthorized =
      (session.user.role === "CUSTOMER" &&
        order.customer.userId === session.user.id) ||
      (session.user.role === "RESTAURANT_OWNER" &&
        order.restaurant.userId === session.user.id) ||
      (session.user.role === "DRIVER" &&
        order.delivery?.driver.userId === session.user.id);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { status, note } = data;

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        restaurant: true,
        delivery: {
          include: { driver: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check authorization based on role and status update
    const isAuthorized =
      (session.user.role === "RESTAURANT_OWNER" &&
        order.restaurant.userId === session.user.id) ||
      (session.user.role === "DRIVER" &&
        order.delivery?.driver.userId === session.user.id);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            note,
          },
        },
      },
      include: {
        items: {
          include: { menuItem: true },
        },
        restaurant: true,
        delivery: {
          include: { driver: true },
        },
        statusHistory: true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}