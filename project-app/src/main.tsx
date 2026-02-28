import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './app/routes/AppRouter.tsx'
import { ModalProvider } from './shared/context/ModalContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalProvider>
      <AppRouter />
    </ModalProvider>
  </StrictMode>,
)
