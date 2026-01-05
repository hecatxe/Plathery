import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Articles from "./components/Articles.jsx";
import ArticleDetail from "./components/ArticleDetail.jsx";
import "./css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Profile from "./components/Profile.jsx";
import Collection from "./components/Collection.jsx";
import BookDetail from "./components/BookDetail.jsx";
import { BooksProvider } from "./service/BooksProvider.jsx";
import PrivacyPolicy from "./components/Privacidad.jsx";
import TerminosCondiciones from "./components/TerminosCondiciones.jsx";
import Cookies from "./components/Cookies.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

function App() {
  return (
    <BooksProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TerminosCondiciones />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/adminPanel" element={<AdminPanel />} />
      </Routes>
    </BooksProvider>
  );
}

export default App;

