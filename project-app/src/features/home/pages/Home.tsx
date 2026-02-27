import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";
import { Modal } from "../../../shared/components/Modal/Modal";
import { Form } from "../../../shared/components/Forms/Forms/Form";
import "./Home.css";
import type { HerdCardData, OrderHistory } from "../../../modules/herds/types";

interface CreateHerdFormData {
  name: string;
  type: string;
  quantity: number;
}

const herds: HerdCardData[] = [
  { id: "1", name: "Fazenda Santa Luzia", type: "Bovino", quantity: 120 },
  { id: "2", name: "Sítio Boa Esperança", type: "Caprino", quantity: 45 },
  { id: "3", name: "Rancho Primavera", type: "Ovino", quantity: 78 },
];

const orderHistory: OrderHistory[] = [
  { id: "1", herdName: "Fazenda Santa Luzia", date: "20/02/2026", quantity: 10 },
  { id: "2", herdName: "Sítio Boa Esperança", date: "18/02/2026", quantity: 5 },
  { id: "3", herdName: "Rancho Primavera", date: "15/02/2026", quantity: 12 },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreateHerd(data: CreateHerdFormData) {
    console.log("Novo rebanho:", data);
    setIsModalOpen(false);
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

        {/* GRID DE REBANHOS */}
        <div className="home__grid">
          {herds.map((herd) => (
            <Card
              key={herd.id}
              title={herd.name}
              subtitle="Informações do rebanho"
              variant="outlined"
              footer={
                <>
                  <Button variant="edit">Editar</Button>
                  <Button variant="delete">Deletar</Button>
                </>
              }
            >
              <p><strong>Tipo:</strong> {herd.type}</p>
              <p><strong>Quantidade:</strong> {herd.quantity}</p>
            </Card>
          ))}
        </div>

        {/* HISTÓRICO DE PEDIDOS */}
        <section className="home__history">
          <h2 className="home__history-title">Histórico de Pedidos</h2>

          <div className="home__history-list">
            {orderHistory.map((order) => (
              <div key={order.id} className="home__history-item">
                <span>{order.herdName}</span>
                <span>{order.date}</span>
                <span>{order.quantity} animais</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FAB */}
      <Button
        className="home__fab"
        variant="create"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Rebanho"
      >
        <Form<CreateHerdFormData>
          initialValues={{
            name: "",
            type: "",
            quantity: 0,
          }}
          fields={[
            { name: "name", label: "Nome", required: true },
            { name: "type", label: "Tipo", required: true },
            {
              name: "quantity",
              label: "Quantidade",
              type: "number",
              required: true,
            },
          ]}
          onSubmit={handleCreateHerd}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </section>
  );
}