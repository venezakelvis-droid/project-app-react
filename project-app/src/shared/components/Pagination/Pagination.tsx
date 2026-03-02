// Pagination.tsx
import { useState } from "react";
import "./Pagination.css";
import type { PaginationProps } from "./types";
import { Button } from "../Button";



export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage = 1,
  onPageChange,
  maxPageButtons = 5,
}: PaginationProps) {
  const [page, setPage] = useState(currentPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  function goToPage(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    onPageChange(newPage);
  }


  function getPageNumbers() {
    const half = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);


    if (end - start + 1 < maxPageButtons) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxPageButtons - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - maxPageButtons + 1);
      }
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <Button
        className="pagination__button"
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
      >
        &laquo; Anterior
      </Button>

      {getPageNumbers().map((p) => (
        <Button
          key={p}
          className={`pagination__button ${p === page ? "active" : ""}`}
          onClick={() => goToPage(p)}
        >
          {p}
        </Button>
      ))}

      <Button
        className="pagination__button"
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
      >
        Próximo &raquo;
      </Button>
    </div>
  );
}