export type OrderStatus = 
  | 'pending' // Initial state when order is placed
  | 'accepted' // Restaurant accepted the order
  | 'preparing' // Restaurant is preparing the order
  | 'prepared' // Order is prepared
  | 'ready_for_pickup' // Order is ready for driver pickup
  | 'driver_assigned' // Driver has been assigned
  | 'driver_pickup' // Driver picked up the order
  | 'delivering' // Driver is delivering
  | 'delivered' // Order has been delivered
  | 'cancelled'; // Order was cancelled

export interface DeliveryBid {
  id: string;
  driverId: string;
  orderId: string;
  amount: number;
  estimatedTime: number; // in minutes
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  driverId?: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  customerAddress: string;
  restaurantName: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}