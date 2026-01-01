import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Set initial language/dir before first paint (fixes external shared link rendering)
const savedLang = (localStorage.getItem("koreanLearning_language") as "ar" | "ko" | null) ?? "ar";
document.documentElement.lang = savedLang;
document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";

createRoot(document.getElementById("root")!).render(<App />);
