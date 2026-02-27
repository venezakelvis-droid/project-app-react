export type HerdType = "Bovino" | "Caprino" | "Suíno" | "Ovino";

export interface HerdCardData {
  id: string;
  name: string;
  type: HerdType;
  quantity: number;
}

export interface OrderHistory {
  id: string;
  herdName: string;
  date: string;
  quantity: number;
}