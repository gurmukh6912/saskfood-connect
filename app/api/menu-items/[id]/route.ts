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
    if (!session || session.user.role !== "RESTAURANT_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id },
      include: { restaurant: true },
    });

    if (!menuItem || menuItem.restaurant.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "RESTAURANT_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id },
      include: { restaurant: true },
    });

    if (!menuItem || menuItem.restaurant.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.menuItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}