import { NextResponse } from "next/server";

const mockMenus = {
  1: [
    {
      id: 1,
      name: "Spaghetti Carbonara",
      description: "Creamy pasta with pancetta and fresh black pepper",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=2971",
      category: "Pasta",
      preparationTime: "20-25 min",
      available: true
    },
    {
      id: 2,
      name: "Garlic Bread Supreme",
      description: "Freshly baked bread with garlic butter and herbs",
      price: 7.99,
      image: "https://images.unsplash.com/photo-1619531038896-defd9c8f0ce7?auto=format&fit=crop&q=80&w=2940",
      category: "Sides",
      preparationTime: "10-15 min",
      available: true
    }
  ],
  2: [
    {
      id: 1,
      name: "Smoked Brisket Plate",
      description: "12-hour smoked brisket with two sides",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1522057384400-681b421cfebc?auto=format&fit=crop&q=80&w=2940",
      category: "Mains",
      preparationTime: "10-15 min",
      available: true
    }
  ],
  3: [
    {
      id: 1,
      name: "Butter Chicken",
      description: "Creamy tomato curry with tender chicken",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=2940",
      category: "Curry",
      preparationTime: "25-30 min",
      available: true
    }
  ]
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const restaurantId = parseInt(params.id);
  const menu = mockMenus[restaurantId as keyof typeof mockMenus] || [];
  return NextResponse.json(menu);
}