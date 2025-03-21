import { NextResponse } from "next/server";

const mockRestaurants = [
  {
    id: 1,
    name: "Prairie Pasta House",
    cuisine: "Italian",
    rating: 4.5,
    deliveryTime: "30-45 min",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1974"
  },
  {
    id: 2,
    name: "Saskatoon Smokehouse",
    cuisine: "BBQ",
    rating: 4.7,
    deliveryTime: "40-55 min",
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=1975"
  },
  {
    id: 3,
    name: "Northern Spice",
    cuisine: "Indian",
    rating: 4.6,
    deliveryTime: "35-50 min",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=2036"
  }
];

export async function GET() {
  return NextResponse.json(mockRestaurants);
}