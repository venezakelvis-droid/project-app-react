import type { HerdCardData } from "../../../../modules/herds/types";

export interface OrderItem {
  herdId: string;
  quantity: number;
  pricePerHead: number;
}

export interface Props {
  herds: HerdCardData[];
  onSubmit: (items: OrderItem[]) => void;
}