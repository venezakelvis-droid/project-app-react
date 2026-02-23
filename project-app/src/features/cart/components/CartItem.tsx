import React from "react";
import type { CartItemData } from "../types";
import { Button } from "../../../shared/components/Button";

interface CartItemProps {
  item: CartItemData;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export function CartItem({ item, onRemove, onQuantityChange }: CartItemProps) {
  return (
    <div className="cart-item">
      {item.image && <img src={item.image} alt={item.name} className="cart-item__image" />}
      <div className="cart-item__info">
        <h4 className="cart-item__name">{item.name}</h4>
        <p className="cart-item__price">${item.price.toFixed(2)}</p>
        <div className="cart-item__actions">
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
            className="cart-item__quantity"
          />
          <Button variant="delete" onClick={() => onRemove(item.id)}>
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
}