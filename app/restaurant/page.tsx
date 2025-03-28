"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import { MenuDialog } from "@/components/restaurant/menu-dialog";
import { useState } from "react";
import { MenuItem } from "@/types/restaurant";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function RestaurantDashboard() {
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Butter Chicken",
      description: "Creamy, aromatic curry with tender chicken pieces",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
      category: "Main Course"
    },
    {
      id: "2",
      name: "Garlic Naan",
      description: "Freshly baked flatbread with garlic and butter",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
      category: "Bread"
    }
  ]);

  const handleAddItem = (item: Omit<MenuItem, "id">) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    };
    setMenuItems([...menuItems, newItem]);
  };

  const handleEditItem = (item: Omit<MenuItem, "id">) => {
    if (!editingItem) return;
    setMenuItems(menuItems.map(menuItem => 
      menuItem.id === editingItem.id ? { ...item, id: editingItem.id } : menuItem
    ));
    setEditingItem(undefined);
  };

  const handleDeleteItem = () => {
    if (!deletingItemId) return;
    setMenuItems(menuItems.filter(item => item.id !== deletingItemId));
    setDeleteDialogOpen(false);
    setDeletingItemId(null);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setMenuDialogOpen(true);
  };

  const openDeleteDialog = (itemId: string) => {
    setDeletingItemId(itemId);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
        <Button onClick={() => {
          setEditingItem(undefined);
          setMenuDialogOpen(true);
        }}>
          Add New Menu Item
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$580.00</div>
            <p className="text-xs text-muted-foreground">+20% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Completed today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Preparation Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 min</div>
            <p className="text-xs text-muted-foreground">-2 min from average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Trending dishes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Active Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          {[1, 2, 3].map((order) => (
            <Card key={order} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Order #{order}</h3>
                  <p className="text-sm text-muted-foreground">2 items • $35.00</p>
                </div>
                <Button variant="outline">Mark as Ready</Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm">1x Butter Chicken - $18.00</p>
                <p className="text-sm">1x Garlic Naan - $17.00</p>
              </div>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="menu" className="space-y-4">
          {menuItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category} • ${item.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <MenuDialog
        open={menuDialogOpen}
        onOpenChange={setMenuDialogOpen}
        onSave={editingItem ? handleEditItem : handleAddItem}
        item={editingItem}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the menu item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}