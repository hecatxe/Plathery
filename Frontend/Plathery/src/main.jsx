import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/custom-bootstrap.scss";
import { UserProvider } from "./service/UserContext.jsx";
import { BooksProvider } from "./service/BooksProvider.jsx";
import 'bootstrap-icons/font/bootstrap-icons.css';

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <BooksProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </BooksProvider>
  </BrowserRouter>
);
