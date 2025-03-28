import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(["CUSTOMER", "DRIVER", "RESTAURANT_OWNER"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, role, phoneNumber } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile in a transaction
    const user = await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          profile: {
            create: {
              firstName,
              lastName,
              phoneNumber
            },
          },
        },
      });

      // Create role-specific record
      switch (role) {
        case "CUSTOMER":
          await prisma.customer.create({
            data: {
              userId: user.id,
            },
          });
          break;
        case "DRIVER":
          await prisma.driver.create({
            data: {
              userId: user.id,
            },
          });
          break;
        case "RESTAURANT_OWNER":
          await prisma.restaurant.create({
            data: {
              userId: user.id,
              name: "", // Will be updated later
              cuisine: [],
              address: "",
              city: "",
              postalCode: "",
              phone: "",
              email: user.email,
              minimumOrder: 0,
              deliveryFee: 0,
              openingHours: {
                
              }
            },
          });
          break;
      }

      return user;
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}