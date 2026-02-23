import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";
import { Cart } from "../../cart/components/Cart";
import type { CartItemData } from "../../cart/types";
import type { UserCardData } from "../types";
import "./Home.css";

const users: UserCardData[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
  },
  {
    id: "2",
    name: "Maria Souza",
    email: "maria@email.com",
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    email: "carlos@email.com",
  },
];

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);


  function handleRemoveItem(id: string) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleChangeQuantity(id: string, quantity: number) {
    if (quantity <= 0) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }
  function handleEdit(user: UserCardData) {
    console.log("Editar usuário:", user);
  }

  return (
    <section className="home">
      <div className="container">
        <header className="home__header">
          <h1 className="home__title">Rebanhos</h1>
          <p className="home__subtitle">
            Gerencie as informações dos seus rebanhos cadastrados
          </p>
        </header>

        <div className="home__grid">
          {users.map((user) => (
            <Card
              key={user.id}
              title={user.name}
              subtitle="Informações básicas"
              variant="outlined"
              onClick={() => console.log("Card clicado:", user)}
              footer={
                <>
                  <Button variant="edit" onClick={() => console.log("Editar")}>
                    Editar
                  </Button>

                  <Button variant="delete" onClick={() => console.log("Deletar")}>
                    Deletar
                  </Button>

                  <Button variant="link" onClick={() => console.log("Link")}>
                    Ver mais
                  </Button>
                </>
              }
            >
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </Card>
          ))}
        </div>
        <Cart
          items={cartItems}
          onRemoveItem={handleRemoveItem}
          onChangeQuantity={handleChangeQuantity}
        />
      </div>
    </section>
  );
}