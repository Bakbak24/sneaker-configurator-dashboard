export interface Order {
  id: string;
  customer: string;
  date: string;
  status: "in-production" | "shipped" | "canceled";
  laceColor?: {
    color: string;
    material: string;
  };
  soleColor?: {
    color: string;
    material: string;
  };
  tongueColor?: {
    color: string;
    material: string;
  };
  tipColor?: {
    color: string;
    material: string;
  };
}

export type OrderStatus = "in-production" | "shipped" | "canceled";
