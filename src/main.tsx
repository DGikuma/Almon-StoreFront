import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

// Temporarily disabled StrictMode due to react-leaflet compatibility issue
// StrictMode causes double-rendering which conflicts with Leaflet map initialization
// This is a known issue: https://github.com/PaulLeCam/react-leaflet/issues/782
// In production builds, StrictMode is typically disabled anyway
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider>
      <App />
    </Provider>
  </BrowserRouter>
);
