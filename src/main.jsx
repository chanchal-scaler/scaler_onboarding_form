import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initMixpanel } from "./analytics/mixpanel.js";
import { installButtonClickTracking } from "./analytics/buttonClickTracking.js";
import "./index.css";
import App from "./App.jsx";

initMixpanel();
installButtonClickTracking();

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
