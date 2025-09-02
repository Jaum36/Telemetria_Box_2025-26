import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TelemetriaBox from "./page/TelemetriaBox.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TelemetriaBox />
  </StrictMode>,
);
