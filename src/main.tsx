import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store/store.ts";
import { ThemeProvider } from "./app/theme/ThemeProvider.tsx";
import { AuthInitializer } from "./components/auth/AuthInitializer.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthInitializer>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthInitializer>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
