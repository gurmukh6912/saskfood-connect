import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    const bid = await prisma.deliveryBid.findUnique({
      where: { id: params.id },
      include: {
        order: {
          include: { restaurant: true },
        },
        driver: true,
      },
    });

    if (!bid) {
      return NextResponse.json(
        { error: "Delivery bid not found" },
        { status: 404 }
      );
    }

    // Check authorization based on role
    const isAuthorized =
      (session.user.role === "RESTAURANT_OWNER" &&
        bid.order.restaurant.userId === session.user.id) ||
      (session.user.role === "DRIVER" &&
        bid.driver.userId === session.user.id);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedBid = await prisma.deliveryBid.update({
      where: { id: params.id },
      data,
      include: {
        order: true,
        driver: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
    });

    // If bid is accepted, create delivery and update order
    if (data.status === "ACCEPTED") {
      await prisma.$transaction([
        prisma.delivery.create({
          data: {
            orderId: bid.orderId,
            driverId: bid.driverId,
            status: "PENDING",
          },
        }),
        prisma.order.update({
          where: { id: bid.orderId },
          data: {
            status: "DRIVER_ASSIGNED",
            statusHistory: {
              create: {
                status: "DRIVER_ASSIGNED",
                note: `Driver ${bid.driver.user.profile?.firstName} ${bid.driver.user.profile?.lastName} assigned`,
              },
            },
          },
        }),
      ]);
    }

    return NextResponse.json(updatedBid);
  } catch (error) {
    console.error("Error updating delivery bid:", error);
    return NextResponse.json(
      { error: "Failed to update delivery bid" },
      { status: 500 }
    );
  }
}