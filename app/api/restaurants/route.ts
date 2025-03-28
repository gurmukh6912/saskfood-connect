import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cuisine = searchParams.get("cuisine");
    const city = searchParams.get("city");
    const minRating = searchParams.get("minRating");

    const where = {
      ...(cuisine && { cuisine: { has: cuisine } }),
      ...(city && { city }),
      ...(minRating && { rating: { gte: parseFloat(minRating) } }),
      isOpen: true,
    };

    const restaurants = await prisma.restaurant.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        cuisine: true,
        address: true,
        city: true,
        image: true,
        rating: true,
        minimumOrder: true,
        deliveryFee: true,
        isOpen: true,
      },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "RESTAURANT_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const restaurant = await prisma.restaurant.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { error: "Failed to create restaurant" },
      { status: 500 }
    );
  }
}