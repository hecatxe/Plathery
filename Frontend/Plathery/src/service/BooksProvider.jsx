import React, { createContext, useContext, useState, useEffect } from "react";

const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  // Carga los favoritos desde el backend al iniciar
  const loadFavorites = async () => {
    try {
      const res = await fetch("http://localhost:3000/favorites", {
        credentials: "include", // usa la cookie de sesión
      });
      if (res.ok) {
        const data = await res.json();
        setBooks(data.favorites);
      }
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    }
  };

  // Añade los libro a favoritos (POST al backend)
  const addBook = async (book) => {
    try {
      const res = await fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bookId: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          year: book.year,
          isbn: book.isbn,
          synopsis: book.synopsis,
          linkAmazon: book.linkAmazon,
          status: book.status || "Favorito",
        }),
      });

      if (res.ok) {
        setBooks((prev) => {
          if (prev.some((b) => b.id === book.id)) return prev;
          return [...prev, { ...book, status: "Favorito" }];
        });
      }
    } catch (err) {
      console.error("Error añadiendo favorito:", err);
    }
  };

  // Actualiza el estado del libro (PATCH al backend)
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/favorites/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBooks((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };
  const removeBook = async (id) => {
    const res = await fetch(`http://localhost:3000/favorites/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // Carga los favoritos automáticamente al montar el provider
  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <BooksContext.Provider
      value={{
        books,
        setBooks,
        addBook,
        updateStatus,
        loadFavorites,
        removeBook,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => useContext(BooksContext);
