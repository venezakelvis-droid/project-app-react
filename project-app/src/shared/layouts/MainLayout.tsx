import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div>
      <header>
        <Navbar
        items={[
          { label: "Home", path: "/" },
          { label: "+ Rebanho", path: "/breeding" },
          { label: "+ Pedido", path: "/order" },
          { label: "Relatorio", path: "/relatorio" },
        ]}
      />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}