// Home.tsx
import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";
import { Form } from "../../../shared/components/Forms/Forms/Form";
import { useModal } from "../../../shared/context/ModalContext";
import { Pagination } from "../../../shared/components/Pagination/Pagination";
import "./Home.css";
import type { HerdCardData, HerdType, OrderHistory } from "../../../modules/herds/types";

interface CreateHerdFormData {
  name: string;
  type: HerdType;
  quantity: number;
}

const initialHerds: HerdCardData[] = [
  { id: "1", name: "Fazenda Santa Luzia", type: "Bovino", quantity: 120 },
  { id: "2", name: "Sítio Boa Esperança", type: "Caprino", quantity: 45 },
  { id: "3", name: "Rancho Primavera", type: "Ovino", quantity: 78 },
  { id: "4", name: "Fazenda Nova Vida", type: "Bovino", quantity: 60 },
  { id: "5", name: "Sítio Sol Nascente", type: "Caprino", quantity: 30 },
];

const initialOrders: OrderHistory[] = [
  { id: "1", herdName: "Fazenda Santa Luzia", date: "20/02/2026", quantity: 10 },
  { id: "2", herdName: "Sítio Boa Esperança", date: "18/02/2026", quantity: 5 },
  { id: "3", herdName: "Rancho Primavera", date: "15/02/2026", quantity: 12 },
];

export default function Home() {
  const { openModal, closeModal } = useModal();

  const [herdList, setHerdList] = useState<HerdCardData[]>(initialHerds);
  const [orderHistory] = useState<OrderHistory[]>(initialOrders);

  /* =========================
     PAGINAÇÃO
  ========================== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHerds = herdList.slice(indexOfFirstItem, indexOfLastItem);

  /* =========================
     CREATE
  ========================== */
  function handleCreateHerd(data: CreateHerdFormData) {
    const newHerd: HerdCardData = {
      id: crypto.randomUUID(),
      ...data,
    };
    setHerdList((prev) => [...prev, newHerd]);
    closeModal();
  }

  function handleOpenCreateModal() {
    openModal(
      <Form<CreateHerdFormData>
        initialValues={{ name: "", type: "Bovino", quantity: 0 }}
        fields={[
          { name: "name", label: "Nome", required: true },
          { name: "type", label: "Tipo", required: true },
          { name: "quantity", label: "Quantidade", type: "number", required: true },
        ]}
        onSubmit={handleCreateHerd}
        onCancel={closeModal}
      />,
      "Novo Rebanho"
    );
  }

  /* =========================
     EDIT
  ========================== */
  function handleOpenEditModal(herd: HerdCardData) {
    openModal(
      <Form<CreateHerdFormData>
        initialValues={{ name: herd.name, type: herd.type, quantity: herd.quantity }}
        fields={[
          { name: "name", label: "Nome", required: true },
          { name: "type", label: "Tipo", required: true },
          { name: "quantity", label: "Quantidade", type: "number", required: true },
        ]}
        onSubmit={(data) => {
          setHerdList((prev) => prev.map((h) => (h.id === herd.id ? { ...h, ...data } : h)));
          closeModal();
        }}
        onCancel={closeModal}
      />,
      "Editar Rebanho"
    );
  }

  /* =========================
     DELETE
  ========================== */
  function handleDeleteHerd(id: string) {
    openModal(
      <div style={{ padding: "1rem" }}>
        <p>Tem certeza que deseja deletar este rebanho?</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button
            variant="delete"
            onClick={() => {
              setHerdList((prev) => prev.filter((herd) => herd.id !== id));
              closeModal();
            }}
          >
            Confirmar
          </Button>
          <Button variant="default" onClick={closeModal}>
            Cancelar
          </Button>
        </div>
      </div>,
      "Confirmar Exclusão"
    );
  }

  /* =========================
     RENDER
  ========================== */
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
          {currentHerds.map((herd) => (
            <Card
              key={herd.id}
              title={herd.name}
              subtitle="Informações do rebanho"
              variant="outlined"
              footer={
                <>
                  <Button variant="edit" onClick={() => handleOpenEditModal(herd)}>
                    Editar
                  </Button>
                  <Button variant="delete" onClick={() => handleDeleteHerd(herd.id)}>
                    Deletar
                  </Button>
                </>
              }
            >
              <p><strong>Tipo:</strong> {herd.type}</p>
              <p><strong>Quantidade:</strong> {herd.quantity}</p>
            </Card>
          ))}
        </div>

        {/* PAGINAÇÃO */}
        <Pagination
          totalItems={herdList.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

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
      <Button className="home__fab" variant="create" onClick={handleOpenCreateModal}>
        +
      </Button>
    </section>
  );
}