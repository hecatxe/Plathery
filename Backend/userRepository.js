import { db } from "./db/firebase.js";
import bcrypt from "bcrypt";

export class UserRepository {
  static async create(username, password) {
    Validation.usernameValidation(username);
    Validation.passwordValidation(password);

    // comprobar si ya existe
    const snapshot = await db
      .collection("users")
      .where("username", "==", username)
      .get();
    if (!snapshot.empty) throw new Error("El usuario ya existe");

    // hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // crear documento en Firestore
    const userRef = db.collection("users").doc();
    await userRef.set({
      username,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    return userRef.id;
  }

  static async login(username, password) {
    Validation.usernameValidation(username);
    Validation.passwordValidation(password);

    const snapshot = await db
      .collection("users")
      .where("username", "==", username)
      .get();
    if (snapshot.empty) throw new Error("El usuario no existe");

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) throw new Error("Contraseña incorrecta");
    // Si el usuario no tiene rol, asignar "user" por defecto
    if (!user.role) {
      await userDoc.ref.update({ role: "user" });
      user.role = "user";
    }

    const { password: _, ...publicUser } = user;
    return { id: userDoc.id, ...publicUser };
  }
}

class Validation {
  static usernameValidation(username) {
    if (typeof username !== "string")
      throw new Error("El usuario debe ser un string");
    if (username.length < 3)
      throw new Error("El usuario debe tener más de 3 caracteres");
  }

  static passwordValidation(password) {
    if (typeof password !== "string")
      throw new Error("La contraseña debe ser un string");
    if (password.length < 6)
      throw new Error("La contraseña debe tener al menos 6 caracteres");
  }
}
