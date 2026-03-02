import { useState } from "react";
import { Button } from "../../Button";
import { Input } from "../../Input";
import { useModal } from "../../../context/ModalContext";
import type { OrderItem, Props } from "./types";



export function CreateOrderForm({ herds, onSubmit }: Props) {
  const { closeModal } = useModal();

  const [items, setItems] = useState<OrderItem[]>([
    { herdId: "", quantity: 0, pricePerHead: 0 },
  ]);

  function handleChange(
    index: number,
    field: keyof OrderItem,
    value: string
  ) {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]:
        field === "herdId"
          ? value
          : Number(value),
    };

    setItems(updated);
  }

  function addItem() {
    setItems([
      ...items,
      { herdId: "", quantity: 0, pricePerHead: 0 },
    ]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(items);
    closeModal();
  }

  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.pricePerHead,
    0
  );

  return (
    <form onSubmit={handleSubmit} className="order-form">
      {items.map((item, index) => (
        <div key={index} className="order-item">
          <select
            value={item.herdId}
            onChange={(e) =>
              handleChange(index, "herdId", e.target.value)
            }
            required
          >
            <option value="">Selecione o rebanho</option>
            {herds.map((herd) => (
              <option key={herd.id} value={herd.id}>
                {herd.name} ({herd.quantity} disponíveis)
              </option>
            ))}
          </select>

          <Input
            id={`quantity-${index}`}
            label="Quantidade"
            type="number"
            value={item.quantity}
            onChange={(e) =>
              handleChange(index, "quantity", e.target.value)
            }
            required
          />

          <Input
            id={`price-${index}`}
            label="Valor por cabeça"
            type="number"
            value={item.pricePerHead}
            onChange={(e) =>
              handleChange(index, "pricePerHead", e.target.value)
            }
            required
          />

          {items.length > 1 && (
            <Button
              type="button"
              variant="delete"
              onClick={() => removeItem(index)}
            >
              Remover
            </Button>
          )}
        </div>
      ))}

      <Button type="button" variant="create" onClick={addItem}>
        + Adicionar Rebanho
      </Button>

      <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
        Total: R$ {total.toFixed(2)}
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <Button type="submit" variant="create">
          Criar Pedido
        </Button>
        <Button type="button" variant="delete" onClick={closeModal}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}