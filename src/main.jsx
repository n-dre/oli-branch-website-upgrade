import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { Toaster } from "sonner";
import "@/index.css";
import App from "@/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <App />
        <Toaster position="top-right" richColors />
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
);