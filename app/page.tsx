"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Truck, Store, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const roles = [
    {
      title: "For Drivers",
      description: "Start delivering food and earn money on your schedule",
      icon: Truck,
      href: "/driver",
      color: "text-blue-500",
    },
    {
      title: "For Restaurants",
      description: "Partner with us to reach more customers and grow your business",
      icon: Store,
      href: "/restaurant",
      color: "text-green-500",
    },
    {
      title: "For Customers",
      description: "Order your favorite food from local restaurants",
      icon: Users,
      href: "/customer",
      color: "text-purple-500",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-4">
            SaskFood Connect
          </h1>
          <p className="text-xl text-gray-600">
            Connecting restaurants, drivers, and food lovers across Saskatchewan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <Card key={role.title} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`${role.color} mb-4`}>
                  <role.icon size={32} />
                </div>
                <CardTitle className="text-2xl">{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={role.href}>
                  <Button className="w-full group-hover:bg-primary/90">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}