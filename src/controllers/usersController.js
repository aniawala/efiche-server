import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import validateNewUserData from "../utils/validation.js";
import User from "../models/userModel.js";

export const signupUser = async (req, res) => {
  try {
    const result = await validateNewUserData(req.body);
    const { username, email, password } = result;
    if (await User.findOne({ username }))
      return res.status(409).json({ message: "Username already exists" });
    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email already exists" });
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username)
    return res.status(400).json({ message: "Username is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username" });
    if (await bcryptjs.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        process.env.JWT_SECRET
      );
      return res.json({ accessToken: token });
    }
    res.status(400).json({ message: "Invalid password" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
