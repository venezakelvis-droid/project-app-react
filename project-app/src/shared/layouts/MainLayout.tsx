import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div>
      <header>
        <Navbar
        items={[
          { label: "Home", path: "/" },
        ]}
      />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}