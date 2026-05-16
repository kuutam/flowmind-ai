import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Default to editorial light mode; user can toggle dark via the Topbar.
document.documentElement.classList.remove("dark");

createRoot(document.getElementById("root")!).render(<App />);
