import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "./db/firebase.js";
import { UserRepository } from "./userRepository.js";
import { JWT_SECRET_KEY } from "./config.js";
const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://plathery.up.railway.app"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Página inicio</h1>");
});

// Iniciar servidor (el puerto)
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Registro de usuario
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const id = await UserRepository.create(username, password);
    res.send({ id, role: "user" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Login de usuario
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserRepository.login(username, password);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .send({ user, token });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

// Cerrar sesión del usuario
app.post("/logout", (req, res) => {
  res.clearCookie("token").send({ message: "Sesión cerrada con éxito." });
});

// Para ir a la página de perfil y obtener los datos del usuario autenticado
app.post("/me", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ error: "No autenticado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    res.send({ user: decoded });
  } catch (err) {
    res.status(401).send({ error: "Token inválido" });
  }
});

// Añadir libro a favoritos (para que se guarden los libros favoritos del usuario)
app.post("/favorites", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ error: "No autenticado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return res.status(401).send({ error: "Token inválido" });
  }

  const userId = decoded.id;
  const {
    bookId,
    title,
    author,
    coverImage,
    year,
    isbn,
    synopsis,
    linkAmazon,
    status,
  } = req.body;

  try {
    await db
      .collection("users")
      .doc(userId.toString())
      .collection("favorites")
      .doc(bookId)
      .set(
        {
          title,
          author,
          coverImage,
          year,
          isbn,
          synopsis,
          linkAmazon,
          status: status || "Favorito",
          addedAt: new Date(),
        },
        { merge: true }
      );

    res.json({ success: true });
  } catch (err) {
    console.error("Error añadiendo favorito:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Obtener favoritos del usuario
app.get("/favorites", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ error: "No autenticado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return res.status(401).send({ error: "Token inválido" });
  }

  const userId = decoded.id;

  try {
    const snapshot = await db
      .collection("users")
      .doc(userId.toString())
      .collection("favorites")
      .get();

    const favorites = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ favorites });
  } catch (err) {
    console.error("Error obteniendo favoritos:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Actualizar estado de un libro favorito
app.patch("/favorites/:id", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ error: "No autenticado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return res.status(401).send({ error: "Token inválido" });
  }

  const userId = decoded.id;
  const bookId = req.params.id;
  const { status } = req.body;

  try {
    await db
      .collection("users")
      .doc(userId.toString())
      .collection("favorites")
      .doc(bookId)
      .set({ status, updatedAt: new Date() }, { merge: true });

    res.json({ success: true });
  } catch (err) {
    console.error("Error actualizando estado:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Eliminar libro de favoritos
app.delete("/favorites/:id", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ error: "No autenticado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return res.status(401).send({ error: "Token inválido" });
  }

  const userId = decoded.id;
  const bookId = req.params.id;

  try {
    const favRef = db
      .collection("users")
      .doc(userId.toString())
      .collection("favorites")
      .doc(bookId);

    const favDoc = await favRef.get();
    if (!favDoc.exists) {
      return res.status(404).send({ error: "Favorito no encontrado" });
    }

    await favRef.delete();
    res.json({ success: true });
  } catch (err) {
    console.error("Error eliminando favorito:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Añadir comentario a un libro (requiere sesión)
app.post("/books/:id/comments", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "No autenticado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }

  const userId = decoded.id;
  const { text, rating } = req.body;
  const bookId = req.params.id;

  try {
    const commentsRef = db
      .collection("books")
      .doc(bookId)
      .collection("comments");
    const newComment = {
      userId,
      username: decoded.username,
      text,
      rating: Number(rating),
      likes: 0,
      likedBy: [],
    };

    const docRef = await commentsRef.add(newComment);
    res.json({ id: docRef.id, ...newComment });
  } catch (err) {
    console.error("Error añadiendo comentario:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Obtener comentarios de un libro (público)
app.get("/books/:id/comments", async (req, res) => {
  const bookId = req.params.id;

  try {
    const commentsRef = db
      .collection("books")
      .doc(bookId)
      .collection("comments");
    const snapshot = await commentsRef.get();

    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ comments });
  } catch (err) {
    console.error("Error obteniendo comentarios:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Dar o quitar like (requiere sesión)
app.post("/books/:bookId/comments/:commentId/like", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "No autenticado" });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }

  const userId = decoded.id;
  const { bookId, commentId } = req.params;

  try {
    const commentRef = db
      .collection("books")
      .doc(bookId)
      .collection("comments")
      .doc(commentId);
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists)
      return res.status(404).json({ error: "Comentario no encontrado" });

    const data = commentDoc.data();
    let likedBy = data.likedBy || [];
    let likes = data.likes || 0;

    let userLikedThis = false; // Variable para saber el estado final

    if (likedBy.includes(userId)) {
      likedBy = likedBy.filter((id) => id !== userId);
      likes--;
      userLikedThis = false; // Se quitó el like
    } else {
      likedBy.push(userId);
      likes++;
      userLikedThis = true; // Se puso el like
    }

    await commentRef.update({ likedBy, likes });

    // Devolvemos liked: userLikedThis
    res.json({ success: true, likes, likedBy, liked: userLikedThis });
  } catch (err) {
    console.error("Error en like:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

//Añadir un libro (solo admin)
app.post("/books", isAdmin, async (req, res) => {
  const { title, author, year, isbn, genre, synopsis, coverImage, linkAmazon } =
    req.body;

  try {
    const newBookRef = await db.collection("books").add({
      title,
      author,
      year,
      isbn,
      genre,
      synopsis,
      coverImage,
      linkAmazon,
      createdAt: new Date(),
    });
    res.json({ id: newBookRef.id });
  } catch (err) {
    console.error("Error añadiendo libro:", err);
    res.status(500).json({ error: "Error interno" });
  }
});
//Middleware  que verifica si el usuario es admin, para acceder a la ruta
function isAdmin(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ error: "No autenticado" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    if (decoded.role !== "admin")
      return res.status(403).send({ error: "Acceso denegado" });
    next();
  } catch (err) {
    res.status(401).send({ error: "Token inválido" });
  }
}
// Ruta protegida solo para admins
app.get("/admin", isAdmin, (req, res) => {
  res.send("<h1>Panel de administración</h1>");
});
// Obtener todos los libros (público)
app.get("/books", async (req, res) => {
  try {
    const snapshot = await db.collection("books").get();
    const books = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        author: data.author,
        year: data.year,
        coverImage: data.coverImage,
        isbn: data.isbn,
        synopsis: data.synopsis,
        linkAmazon: data.linkAmazon,
        genre: data.genre,
        createdAt: data.createdAt,
      };
    });
    res.json(books);
  } catch (err) {
    console.error("Error obteniendo libros:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener un libro por ID (público)
app.get("/books/:id", async (req, res) => {
  try {
    const doc = await db.collection("books").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Error obteniendo libro:", err);
    res.status(500).json({ error: "Error interno" });
  }
});
