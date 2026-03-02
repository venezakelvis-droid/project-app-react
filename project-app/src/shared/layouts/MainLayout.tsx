import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useModal } from "../../shared/context/ModalContext";
import type { HerdCardData } from "../../modules/herds/types";
import { CreateOrderForm } from "../components/Forms/Order/CreateOrderForm";
import { useAuth } from "../../features/auth/context/AuthContext";

const mockHerds: HerdCardData[] = [
  { id: "1", name: "Fazenda Santa Luzia", type: "Bovino", quantity: 120 },
  { id: "2", name: "Sítio Boa Esperança", type: "Caprino", quantity: 45 },
  { id: "3", name: "Rancho Primavera", type: "Ovino", quantity: 78 },
];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const {logout} = useAuth()

  useEffect(() => {
    if (location.pathname === "/order") {
      openModal(
        <CreateOrderForm
          herds={mockHerds}
          onSubmit={(items) => {
            console.log("Pedido criado:", items);
          }}
        />,
        "Novo Pedido"
      );

      
      // volta para home para não ficar preso na rota
      navigate("/");
    }
    if(location.pathname === "/logout"){
      logout()
      navigate("/");
    }
  }, [location]);

  return (
    <div>
      <header>
        <Navbar
         
          items={[
            { label: "Home", path: "/" },
            { label: "+ Rebanho", path: "/breeding" },
            { label: "+ Pedido", path: "/order" },
            { label: "Relatorio", path: "/relatorio" },
            { label: "Sair", path: "/logout" },
          ]}
        />
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}