import { MenuItem } from './restaurant';

export interface CartItem extends MenuItem {
  quantity: number;
  restaurant: string;
}