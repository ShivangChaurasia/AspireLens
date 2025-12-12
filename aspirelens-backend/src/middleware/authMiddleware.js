import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    let token;

    // Accept both: Authorization header OR cookie (future enhancement)
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // OPTIONAL — fetch latest user data from DB
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "Invalid token - User not found" });
    }

    // attach full user object instead of only decoded token
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
  }
};
