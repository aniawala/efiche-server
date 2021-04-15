import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import Joi from "joi";
import jwt from "jsonwebtoken";

const validateUserData = async (userData) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return await schema.validateAsync(userData, { abortEarly: false });
};

export const registerUser = async (req, res) => {
  try {
    const result = await validateUserData(req.body);
    const { username, email, password } = result;
    if (await User.findOne({ username: username }))
      return res.status(409).json({ message: "Username already exists" });
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
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: `Invalid username` });
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
