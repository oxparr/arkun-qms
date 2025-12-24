import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App.tsx";
import Login from "./Login.tsx";
import { AuthProvider, useAuth } from "./lib/auth.tsx";
import "./index.css";

function Root() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return user ? <App /> : <Login />;
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </AuthProvider>
);