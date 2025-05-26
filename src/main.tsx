import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css'; // This line imports your renamed styles.css file
import App from './App'; // This line imports your renamed DNAFloraisonApp.tsx component

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);