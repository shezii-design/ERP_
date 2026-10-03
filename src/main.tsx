import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('NexusERP ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
      console.error('NexusERP ServiceWorker registration failed: ', err);
    });
  });
}

createRoot(getElementByIdRoot()).render(<App />);

function getElementByIdRoot() {
  const el = document.getElementById('root');
  if (!el) throw new Error('Root element not found');
  return el;
}
