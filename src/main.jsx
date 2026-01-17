import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import ErrorBoundary from "@/components/ErrorBoundary";
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update
// vite-plugin-pwa handles the heavy lifting
const updateSW = registerSW({
  // Auto-update service worker when new version is available
  onNeedRefresh() {
    // Automatically update - no user prompt needed
    updateSW(true);
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
  // Check for updates every minute when visible
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      setInterval(() => {
        if (document.visibilityState === 'visible') {
          registration.update();
        }
      }, 60 * 1000);
    }
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
