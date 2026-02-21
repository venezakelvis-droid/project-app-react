import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import type { NavbarProps } from "./types";

export default function Navbar({ logo, items }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            {logo ? <img src={logo} alt="logo" /> : <span>MyApp</span>}
          </div>

          <button className={styles.menuButton} onClick={toggleMenu}>
            ☰
          </button>

          <ul className={styles.desktopMenu}>
            {items.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={
                    location.pathname === item.path
                      ? styles.active
                      : ""
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={closeMenu}></div>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          isOpen ? styles.open : ""
        }`}
      >
        <ul>
          {items.map((item) => (
            <li key={item.path}>
              <Link to={item.path} onClick={closeMenu}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}