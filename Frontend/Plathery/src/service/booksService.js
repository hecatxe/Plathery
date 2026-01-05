import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;


// Servicio para obtener los bestsellers
export const getBestSellersNYT = async (list = "hardcover-fiction") => {
  const res = await axios.get(`${API_BASE_URL}/lists/current/${list}.json`, {
    params: { "api-key": API_KEY },
  });
  return res.data.results.books;
};
// Servicio que obtiene todos los libros
export async function getBooks() {
  const res = await fetch("http://localhost:3000/books", {
    credentials: "include",
  });
  return res.json();
}
// Servicio que obtiene un libro por su ID
export async function getBookById(id) {
  const res = await fetch(`http://localhost:3000/books/${id}`, {
    credentials: "include",
  });
  return res.json();
}
