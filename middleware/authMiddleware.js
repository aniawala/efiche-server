import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Authorization failed" });

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    req.user = result;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export default auth;
