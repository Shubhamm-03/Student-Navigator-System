import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Toaster
        position="top-center"
        gutter={10}
        toastOptions={{
          style: {
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: 500,
          },
          success: {
            iconTheme: { primary: "#4f46e5", secondary: "#ffffff" },
          },
          error: {
            iconTheme: { primary: "#e11d48", secondary: "#ffffff" },
          },
        }}
      />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);