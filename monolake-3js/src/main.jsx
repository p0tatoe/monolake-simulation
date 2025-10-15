import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { A11yUserPreferences } from "@react-three/a11y";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <>
    <A11yUserPreferences>
      <App />
    </A11yUserPreferences>
  </>
);
