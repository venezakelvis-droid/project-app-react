export interface CartItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartProps {
  items: CartItemData[];
  onRemoveItem: (id: string) => void;
  onChangeQuantity: (id: string, quantity: number) => void;
}