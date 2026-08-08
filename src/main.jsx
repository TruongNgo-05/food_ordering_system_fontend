import { createRoot } from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CustomerDataProvider } from "./context/CustomerDataContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CustomerDataProvider>
        <App />
      </CustomerDataProvider>
    </AuthProvider>
  </BrowserRouter>,
);
