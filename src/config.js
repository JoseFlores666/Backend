export const PORT = process.env.PORT || 4000;

export const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://Eduardo_465:OR5p2WBrfXv3SHlN@mi-cluster.fcmbkk4.mongodb.net/dbSolicitud?retryWrites=true&w=majority&appName=Mi-Cluster";

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// export const FRONTEND_URL = process.env.FRONTEND_URL || "https://frontend-wheat-psi.vercel.app/";

export const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME || "dnhnnr5um";

export const CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY || "324293189525951";

export const CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET || "GW7Ep1-kuD3ClTVCHasAmF76LTM";

export const CLOUDINARY_FOLDER =
  process.env.CLOUDINARY_FOLDER || "ImagenInnego";
