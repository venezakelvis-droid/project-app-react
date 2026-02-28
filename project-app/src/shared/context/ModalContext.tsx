import { createContext, useContext, useState, type ReactNode } from "react";

interface ModalContextData {
  openModal: (content: ReactNode, title?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextData | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

import { Modal } from "../components/Modal/Modal";

export function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [title, setTitle] = useState<string | undefined>();

  function openModal(modalContent: ReactNode, modalTitle?: string) {
    setContent(modalContent);
    setTitle(modalTitle);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setContent(null);
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <Modal isOpen={isOpen} onClose={closeModal} title={title}>
        {content}
      </Modal>
    </ModalContext.Provider>
  );
}