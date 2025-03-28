import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "DRIVER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const driver = await prisma.driver.findFirst({
      where: { userId: session.user.id },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Driver not found" },
        { status: 404 }
      );
    }

    const bid = await prisma.deliveryBid.create({
      data: {
        ...data,
        driverId: driver.id,
        status: "PENDING",
      },
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

    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    console.error("Error creating delivery bid:", error);
    return NextResponse.json(
      { error: "Failed to create delivery bid" },
      { status: 500 }
    );
  }
}