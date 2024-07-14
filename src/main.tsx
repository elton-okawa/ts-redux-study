import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.tsx';
import { worker } from './api/server.js';
import { store } from './app/store.ts';
import './index.css';

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  await worker.start({ onUnhandledRequest: 'bypass' });

  const root = createRoot(document.getElementById('root')!);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  );
}

start();
