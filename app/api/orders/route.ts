import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let orders;
    switch (session.user.role) {
      case "CUSTOMER":
        orders = await prisma.order.findMany({
          where: {
            customer: { userId: session.user.id },
            ...(status && { status }),
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
          orderBy: { createdAt: "desc" },
        });
        break;

      case "RESTAURANT_OWNER":
        orders = await prisma.order.findMany({
          where: {
            restaurant: { userId: session.user.id },
            ...(status && { status }),
          },
          include: {
            items: {
              include: { menuItem: true },
            },
            customer: {
              include: { profile: true },
            },
            delivery: {
              include: { driver: true },
            },
            statusHistory: true,
          },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "DRIVER":
        orders = await prisma.order.findMany({
          where: {
            delivery: { driver: { userId: session.user.id } },
            ...(status && { status }),
          },
          include: {
            items: {
              include: { menuItem: true },
            },
            restaurant: true,
            customer: {
              include: { profile: true },
            },
            statusHistory: true,
          },
          orderBy: { createdAt: "desc" },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const customer = await prisma.customer.findFirst({
      where: { userId: session.user.id },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        ...data,
        status: "PENDING",
        statusHistory: {
          create: {
            status: "PENDING",
          },
        },
      },
      include: {
        items: {
          include: { menuItem: true },
        },
        restaurant: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}