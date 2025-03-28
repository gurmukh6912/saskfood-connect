"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Car, Store, User } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      switch (session.user.role) {
        case "CUSTOMER":
          router.push("/customer");
          break;
        case "DRIVER":
          router.push("/driver");
          break;
        case "RESTAURANT_OWNER":
          router.push("/restaurant");
          break;
      }
    }
  }, [session, router]);

  const roles = [
    {
      title: "Customer",
      description: "Order food from your favorite restaurants",
      icon: User,
      href: "/customer",
      color: "bg-blue-500"
    },
    {
      title: "Driver",
      description: "Deliver food and earn money",
      icon: Car,
      href: "/driver",
      color: "bg-green-500"
    },
    {
      title: "Restaurant",
      description: "Partner with us to reach more customers",
      icon: Store,
      href: "/restaurant",
      color: "bg-orange-500"
    }
  ];

  if (session?.user) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-300 to-teal-300 text-transparent bg-clip-text mb-4">
            SaskFood Connect
          </h1>
          <p className="text-lg text-muted-foreground">
            Connecting restaurants, drivers, and food lovers across Saskatchewan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role) => (
            <Card key={role.title} className="group hover:shadow-lg transition-shadow">
              <Link href="/auth/register">
                <CardHeader>
                  <div className={`${role.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {role.title}
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                  </CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Continue as {role.title}</Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}