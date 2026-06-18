import React from 'react';
import { renderToString } from 'react-dom/server';
import DraftGenerator from './src/pages/DraftGenerator.jsx';
import { ToastProvider } from './src/components/ToastContext.jsx';

try {
  const html = renderToString(
      <ToastProvider>
        <DraftGenerator />
      </ToastProvider>
  );
  console.log("SUCCESS");
} catch(e) {
  console.error("ERROR:");
  console.error(e);
}
