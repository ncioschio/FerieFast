import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Se usi GitHub Pages, sostituisci con il nome del tuo repository:
  // base: "/nome-del-repository/",
  base: "./",
});
