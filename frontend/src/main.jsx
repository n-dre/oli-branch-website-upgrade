import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { DataProvider } from "./context/DataContext.jsx";

// React apps should mount to ONE root element
const container = document.getElementById("root");

if (!container) {
  throw new Error('Root container (#root) not found in index.html');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider>
        <App />
      </DataProvider>
    </BrowserRouter>
  </StrictMode>
);
