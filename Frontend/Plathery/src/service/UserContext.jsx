import { createContext, useContext, useState, useEffect } from "react";
import { useBooks } from "./BooksProvider.jsx";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setBooks, loadFavorites } = useBooks();
  const API = import.meta.env.VITE_API_BACKEND_URL;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API}/me`, {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user ?? null);
        } else {
          setUser(null);
          setBooks([]);
        }
      } catch (err) {
        console.error("Sesión no válida:", err);
        setUser(null);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setBooks([]);
    }
  }, [user]);

  const logout = async () => {
    try {
      await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    }
    setUser(null);
    setBooks([]);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
