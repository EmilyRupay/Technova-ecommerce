import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// Estilos: Bootstrap, íconos y estilos propios (en ese orden).
import './styles/bootstrap.min.css';
import './styles/bootstrap-icons.min.css';
import './styles/styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
