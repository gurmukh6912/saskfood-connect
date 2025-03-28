import { prisma } from "./../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Clean up existing data
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create users with different roles
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create multiple customers
  const customers = await Promise.all([
    prisma.user.create({
      data: {
        email: "john@example.com",
        password: hashedPassword,
        role: "CUSTOMER",
        profile: {
          create: {
            firstName: "John",
            lastName: "Doe",
            phoneNumber: "306-555-0123",
          },
        },
        customer: {
          create: {
            defaultAddress: "123 Main St, Saskatoon, SK S7K 1A1",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "sarah@example.com",
        password: hashedPassword,
        role: "CUSTOMER",
        profile: {
          create: {
            firstName: "Sarah",
            lastName: "Wilson",
            phoneNumber: "306-555-0124",
          },
        },
        customer: {
          create: {
            defaultAddress: "456 Avenue B, Saskatoon, SK S7M 1W4",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "michael@example.com",
        password: hashedPassword,
        role: "CUSTOMER",
        profile: {
          create: {
            firstName: "Michael",
            lastName: "Brown",
            phoneNumber: "306-555-0125",
          },
        },
        customer: {
          create: {
            defaultAddress: "789 20th St W, Saskatoon, SK S7M 0X1",
          },
        },
      },
    }),
  ]);

  // Create multiple restaurant owners with restaurants
  const restaurants = await Promise.all([
    // Indian Restaurant
    prisma.user.create({
      data: {
        email: "spicydelight@example.com",
        password: hashedPassword,
        role: "RESTAURANT_OWNER",
        profile: {
          create: {
            firstName: "Raj",
            lastName: "Patel",
            phoneNumber: "306-555-0126",
          },
        },
        restaurant: {
          create: {
            name: "Spicy Delight",
            description: "Authentic Indian Cuisine with a modern twist",
            cuisine: ["Indian", "Vegetarian"],
            address: "456 Broadway Ave",
            city: "Saskatoon",
            postalCode: "S7K 1B2",
            phone: "306-555-0127",
            email: "contact@spicydelight.com",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
            rating: 4.5,
            minimumOrder: 20,
            deliveryFee: 4.99,
            isOpen: true,
            openingHours: {
              monday: { open: "11:00", close: "22:00" },
              tuesday: { open: "11:00", close: "22:00" },
              wednesday: { open: "11:00", close: "22:00" },
              thursday: { open: "11:00", close: "22:00" },
              friday: { open: "11:00", close: "23:00" },
              saturday: { open: "11:00", close: "23:00" },
              sunday: { open: "12:00", close: "21:00" },
            },
          },
        },
      },
    }),
    // Pizza Restaurant
    prisma.user.create({
      data: {
        email: "pizzaheaven@example.com",
        password: hashedPassword,
        role: "RESTAURANT_OWNER",
        profile: {
          create: {
            firstName: "Mario",
            lastName: "Romano",
            phoneNumber: "306-555-0128",
          },
        },
        restaurant: {
          create: {
            name: "Pizza Heaven",
            description: "Authentic Italian pizzas and pasta",
            cuisine: ["Italian", "Pizza"],
            address: "789 8th Street E",
            city: "Saskatoon",
            postalCode: "S7H 0S1",
            phone: "306-555-0129",
            email: "contact@pizzaheaven.com",
            image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80",
            rating: 4.3,
            minimumOrder: 15,
            deliveryFee: 3.99,
            isOpen: true,
            openingHours: {
              monday: { open: "11:00", close: "23:00" },
              tuesday: { open: "11:00", close: "23:00" },
              wednesday: { open: "11:00", close: "23:00" },
              thursday: { open: "11:00", close: "23:00" },
              friday: { open: "11:00", close: "00:00" },
              saturday: { open: "11:00", close: "00:00" },
              sunday: { open: "12:00", close: "22:00" },
            },
          },
        },
      },
    }),
    // Sushi Restaurant
    prisma.user.create({
      data: {
        email: "sushimaster@example.com",
        password: hashedPassword,
        role: "RESTAURANT_OWNER",
        profile: {
          create: {
            firstName: "Yuki",
            lastName: "Tanaka",
            phoneNumber: "306-555-0130",
          },
        },
        restaurant: {
          create: {
            name: "Sushi Master",
            description: "Fresh and authentic Japanese cuisine",
            cuisine: ["Japanese", "Sushi"],
            address: "123 2nd Ave N",
            city: "Saskatoon",
            postalCode: "S7K 2B2",
            phone: "306-555-0131",
            email: "contact@sushimaster.com",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
            rating: 4.7,
            minimumOrder: 25,
            deliveryFee: 5.99,
            isOpen: true,
            openingHours: {
              monday: { open: "11:30", close: "21:30" },
              tuesday: { open: "11:30", close: "21:30" },
              wednesday: { open: "11:30", close: "21:30" },
              thursday: { open: "11:30", close: "21:30" },
              friday: { open: "11:30", close: "22:30" },
              saturday: { open: "11:30", close: "22:30" },
              sunday: { open: "12:00", close: "21:00" },
            },
          },
        },
      },
    }),
  ]);

  // Create multiple drivers
  const drivers = await Promise.all([
    prisma.user.create({
      data: {
        email: "driver1@example.com",
        password: hashedPassword,
        role: "DRIVER",
        profile: {
          create: {
            firstName: "Mike",
            lastName: "Johnson",
            phoneNumber: "306-555-0132",
          },
        },
        driver: {
          create: {
            isOnline: true,
            currentLocation: { lat: 52.1332, lng: -106.6700 },
            vehicle: {
              create: {
                type: "CAR",
                make: "Toyota",
                model: "Corolla",
                year: 2020,
                licensePlate: "ABC 123",
              },
            },
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "driver2@example.com",
        password: hashedPassword,
        role: "DRIVER",
        profile: {
          create: {
            firstName: "Lisa",
            lastName: "Chen",
            phoneNumber: "306-555-0133",
          },
        },
        driver: {
          create: {
            isOnline: true,
            currentLocation: { lat: 52.1295, lng: -106.6615 },
            vehicle: {
              create: {
                type: "BICYCLE",
                make: "Trek",
                model: "FX 3",
                year: 2022,
                licensePlate: "",
              },
            },
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "driver3@example.com",
        password: hashedPassword,
        role: "DRIVER",
        profile: {
          create: {
            firstName: "David",
            lastName: "Kim",
            phoneNumber: "306-555-0134",
          },
        },
        driver: {
          create: {
            isOnline: false,
            currentLocation: { lat: 52.1368, lng: -106.6534 },
            vehicle: {
              create: {
                type: "SCOOTER",
                make: "Vespa",
                model: "Sprint",
                year: 2021,
                licensePlate: "XYZ 789",
              },
            },
          },
        },
      },
    }),
  ]);

  // Create menu items for each restaurant
  const [indianRestaurant, pizzaRestaurant, sushiRestaurant] = await Promise.all(
    restaurants.map(user => 
      prisma.restaurant.findFirst({
        where: { userId: user.id },
      })
    )
  );

  if (indianRestaurant) {
    await prisma.menuItem.createMany({
      data: [
        {
          restaurantId: indianRestaurant.id,
          name: "Butter Chicken",
          description: "Creamy, aromatic curry with tender chicken pieces",
          price: 18.99,
          image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
          category: "Main Course",
        },
        {
          restaurantId: indianRestaurant.id,
          name: "Garlic Naan",
          description: "Freshly baked flatbread with garlic and butter",
          price: 3.99,
          image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
          category: "Bread",
        },
        {
          restaurantId: indianRestaurant.id,
          name: "Biryani",
          description: "Aromatic rice dish with spices and vegetables",
          price: 16.99,
          image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
          category: "Main Course",
        },
        {
          restaurantId: indianRestaurant.id,
          name: "Palak Paneer",
          description: "Cottage cheese cubes in creamy spinach gravy",
          price: 15.99,
          image: "https://images.unsplash.com/photo-1596797038530-2c107aa2c685?w=800&q=80",
          category: "Main Course",
        },
      ],
    });
  }

  if (pizzaRestaurant) {
    await prisma.menuItem.createMany({
      data: [
        {
          restaurantId: pizzaRestaurant.id,
          name: "Margherita Pizza",
          description: "Fresh tomatoes, mozzarella, basil, and olive oil",
          price: 14.99,
          image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80",
          category: "Pizza",
        },
        {
          restaurantId: pizzaRestaurant.id,
          name: "Pepperoni Pizza",
          description: "Classic pepperoni with mozzarella cheese",
          price: 16.99,
          image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
          category: "Pizza",
        },
        {
          restaurantId: pizzaRestaurant.id,
          name: "Fettuccine Alfredo",
          description: "Creamy pasta with parmesan cheese sauce",
          price: 15.99,
          image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&q=80",
          category: "Pasta",
        },
        {
          restaurantId: pizzaRestaurant.id,
          name: "Garlic Breadsticks",
          description: "Freshly baked breadsticks with garlic butter",
          price: 5.99,
          image: "https://images.unsplash.com/photo-1619531038896-defd931f7ea4?w=800&q=80",
          category: "Sides",
        },
      ],
    });
  }

  if (sushiRestaurant) {
    await prisma.menuItem.createMany({
      data: [
        {
          restaurantId: sushiRestaurant.id,
          name: "California Roll",
          description: "Crab, avocado, and cucumber roll",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
          category: "Rolls",
        },
        {
          restaurantId: sushiRestaurant.id,
          name: "Salmon Nigiri",
          description: "Fresh salmon over pressed sushi rice",
          price: 8.99,
          image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&q=80",
          category: "Nigiri",
        },
        {
          restaurantId: sushiRestaurant.id,
          name: "Tempura Udon",
          description: "Thick noodles in hot soup with tempura",
          price: 16.99,
          image: "https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=800&q=80",
          category: "Noodles",
        },
        {
          restaurantId: sushiRestaurant.id,
          name: "Miso Soup",
          description: "Traditional Japanese soup with tofu",
          price: 4.99,
          image: "https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=800&q=80",
          category: "Soup",
        },
      ],
    });
  }

  // Create sample orders
  if (customers[0] && indianRestaurant && drivers[0]) {
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId: indianRestaurant.id },
      take: 2,
    });

    await prisma.order.create({
      data: {
        customerId: (await prisma.customer.findFirst({ where: { userId: customers[0].id } }))!.id,
        restaurantId: indianRestaurant.id,
        status: "DELIVERED",
        deliveryAddress: "123 Main St, Saskatoon, SK S7K 1A1",
        subtotal: 22.98,
        deliveryFee: 4.99,
        tax: 1.15,
        total: 29.12,
        items: {
          create: menuItems.map(item => ({
            menuItemId: item.id,
            quantity: 1,
            price: item.price,
          })),
        },
        delivery: {
          create: {
            driverId: (await prisma.driver.findFirst({ where: { userId: drivers[0].id } }))!.id,
            status: "DELIVERED",
            pickupTime: new Date(Date.now() - 3600000), // 1 hour ago
            deliveredTime: new Date(Date.now() - 1800000), // 30 minutes ago
          },
        },
        statusHistory: {
          create: [
            { status: "PENDING", createdAt: new Date(Date.now() - 7200000) },
            { status: "ACCEPTED", createdAt: new Date(Date.now() - 5400000) },
            { status: "PREPARING", createdAt: new Date(Date.now() - 4500000) },
            { status: "PREPARED", createdAt: new Date(Date.now() - 3600000) },
            { status: "DRIVER_PICKUP", createdAt: new Date(Date.now() - 3000000) },
            { status: "DELIVERED", createdAt: new Date(Date.now() - 1800000) },
          ],
        },
      },
    });
  }

  if (customers[1] && pizzaRestaurant && drivers[1]) {
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId: pizzaRestaurant.id },
      take: 2,
    });

    await prisma.order.create({
      data: {
        customerId: (await prisma.customer.findFirst({ where: { userId: customers[1].id } }))!.id,
        restaurantId: pizzaRestaurant.id,
        status: "PREPARING",
        deliveryAddress: "456 Avenue B, Saskatoon, SK S7M 1W4",
        subtotal: 20.98,
        deliveryFee: 3.99,
        tax: 1.05,
        total: 26.02,
        items: {
          create: menuItems.map(item => ({
            menuItemId: item.id,
            quantity: 1,
            price: item.price,
          })),
        },
        delivery: {
          create: {
            driverId: (await prisma.driver.findFirst({ where: { userId: drivers[1].id } }))!.id,
            status: "PENDING",
          },
        },
        statusHistory: {
          create: [
            { status: "PENDING", createdAt: new Date(Date.now() - 1800000) },
            { status: "ACCEPTED", createdAt: new Date(Date.now() - 900000) },
            { status: "PREPARING", createdAt: new Date(Date.now() - 300000) },
          ],
        },
      },
    });
  }

  if (customers[2] && sushiRestaurant) {
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId: sushiRestaurant.id },
      take: 3,
    });

    await prisma.order.create({
      data: {
        customerId: (await prisma.customer.findFirst({ where: { userId: customers[2].id } }))!.id,
        restaurantId: sushiRestaurant.id,
        status: "PENDING",
        deliveryAddress: "789 20th St W, Saskatoon, SK S7M 0X1",
        subtotal: 26.97,
        deliveryFee: 5.99,
        tax: 1.35,
        total: 34.31,
        items: {
          create: menuItems.map(item => ({
            menuItemId: item.id,
            quantity: 1,
            price: item.price,
          })),
        },
        statusHistory: {
          create: [
            { status: "PENDING", createdAt: new Date() },
          ],
        },
      },
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });