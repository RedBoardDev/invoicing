import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Worker } from '@react-pdf-viewer/core';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
      <App />
    </Worker>,
  );
}
