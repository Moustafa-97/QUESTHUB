import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY;

export function generateTokenById(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
}
