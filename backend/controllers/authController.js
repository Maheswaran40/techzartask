import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 60 * 60 * 1000,
  path: "/"
});

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, cookieOptions());
    const safeUser = await User.findById(user._id).select("-password");
    res.json({ user: safeUser });
  } catch (err) { next(err); }
}

export function logout(_req, res) {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", path: "/" });
  res.json({ message: "Logged out successfully" });
}

export async function me(req, res, next) {
  try {
    const user = req.user.toObject();
    if (user.role === "employee") {
      user.employeeProfile = await Employee.findOne({ user: user._id });
    }
    res.json({ user });
  } catch (err) { next(err); }
}
