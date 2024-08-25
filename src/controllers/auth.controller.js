import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const usernameFound = await User.findOne({ username });

    if (usernameFound) {
      return res.status(400).json({
        message: ["El nombre de usuario ya está en uso"],
      });
    }

    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json({
        message: ["El email ya esta en uso"],
      });

    // hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating the user
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // saving the user in the database
    const userSaved = await newUser.save();

    // create access token
    const token = await createAccessToken({
      id: userSaved._id,
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      mensaje: "registro exitoso",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({
        message: ["Tu email no esta registrado"],
      });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["La contraseña es incorrecta"],
      });
    }

    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const ActualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params; // el ID del usuario a actualizar
    const { username, email, password } = req.body; // nuevos datos del usuario

    // Buscar el usuario por ID
    const userFound = await User.findById(id);

    if (!userFound)
      return res.status(404).json({
        mensaje: ["Usuario no encontrado"],
      });

    if (username && username !== userFound.username) {
      const existingUserByUsername = await User.findOne({ username });
      if (existingUserByUsername) {
        return res.status(400).json({
          mensaje: ["El usuario ya está en uso"],
        });
      }
    }

    // Verificar si el email ya está en uso por otro usuario
    if (email && email !== userFound.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({
          mensaje: ["El correo electrónico ya está en uso"],
        });
      }
    }

    if (username) userFound.username = username;

    if (email) userFound.email = email;

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      userFound.password = passwordHash;
    } else {
      return res.status(400).json({
        mensaje: ["Ingrese la nueva contraseña"],
      });
    }

    await userFound.save();

    res.status(201).json({
      mensaje: "Modificaión Exitosa",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const traerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("username email"); //el select para solo selecciona los campos username y email
    
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({
        mensaje: ["Usuarios no encontrados"],
      });
    }

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
