import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminAduhai from "./adminAduhai";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/adminaduhai" element={<AdminAduhai />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);