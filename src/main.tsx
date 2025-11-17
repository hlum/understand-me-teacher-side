import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import { applyTheme, setupThemeListener } from "./theme";

// Apply theme before React mounts to prevent flash
applyTheme();
setupThemeListener();

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found!");
}
createRoot(rootElement).render(
	<BrowserRouter>
		<StrictMode>
			<App />
		</StrictMode>
	</BrowserRouter>
);
