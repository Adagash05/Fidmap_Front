import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Style.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { BoardProvider } from "./context/BoardContext.jsx";
import { IdeaProvider } from "./context/IdeaContext.jsx";
import { IdentityProvider } from "./context/IdentityContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* AuthProvider first — BoardContext reads useAuth() to decide
          whether it's allowed to load the workspace's boards. */}
      <AuthProvider>
        <BoardProvider>
          <IdeaProvider>
            <IdentityProvider>
              <App />
            </IdentityProvider>
          </IdeaProvider>
        </BoardProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
