import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import "antd/dist/reset.css";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);