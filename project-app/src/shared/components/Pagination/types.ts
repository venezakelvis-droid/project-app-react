export interface PaginationProps {
  totalItems: number;      // total de itens
  itemsPerPage: number;    // itens por página
  currentPage?: number;    // página inicial (opcional)
  onPageChange: (page: number) => void; // callback ao trocar de página
  maxPageButtons?: number; // máximo de botões visíveis
}