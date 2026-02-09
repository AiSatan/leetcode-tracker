import { createRoot } from "react-dom/client";
import App from "./App";
import './index.css'
import { ThemeProvider } from "./context/ThemeContext";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
} else {
  throw new Error("Root element not found");
}
