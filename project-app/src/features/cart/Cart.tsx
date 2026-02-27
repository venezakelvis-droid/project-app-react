import React, { useState } from "react";
import type { CartProps } from "./types";
import { CartItem } from "./components/CartItem";
import "./components/Cart.css";
import { Button } from "../../shared/components/Button";

export function Cart({ items, onRemoveItem, onChangeQuantity }: CartProps) {
  const [isOpen, setIsOpen] = useState(false);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Botão para mobile */}
      <Button className="cart-toggle" onClick={() => setIsOpen(!isOpen)}>
        +
      </Button>

      <aside className={`cart ${isOpen ? "cart--open" : ""}`}>
        <header className="cart__header">
          <h3>Meu Carrinho</h3>
          <Button className="cart__close" onClick={() => setIsOpen(false)}>✖</Button>
        </header>

        <div className="cart__items">
          {items.length === 0 ? (
            <p className="cart__empty">Seu carrinho está vazio</p>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={onRemoveItem}
                onQuantityChange={onChangeQuantity}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className="cart__footer">
            <p className="cart__total">Total: ${total.toFixed(2)}</p>
            <Button variant="create">Finalizar Compra</Button>
          </footer>
        )}
      </aside>
    </>
  );
}