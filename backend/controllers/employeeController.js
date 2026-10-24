import fs from "fs";
import path from "path";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

const publicEmployee = (employee) => employee;

export async function listEmployees(req, res, next) {
  try {
    const { search = "", department = "", status = "" } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (status) filter.employmentStatus = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json({ employees });
  } catch (err) { next(err); }
}

export async function dashboardStats(_req, res, next) {
  try {
    const [totalEmployees, activeEmployees, departments, recentEmployees] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ employmentStatus: "Active" }),
      Employee.distinct("department"),
      Employee.find().sort({ createdAt: -1 }).limit(5)
    ]);
    res.json({ totalEmployees, activeEmployees, totalDepartments: departments.length, recentEmployees });
  } catch (err) { next(err); }
}

export async function getEmployee(req, res, next) {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ employee: publicEmployee(employee) });
  } catch (err) { next(err); }
}

export async function createEmployee(req, res, next) {
  try {
    const { fullName, email, password, phone = "", department, designation, joiningDate, employmentStatus = "Active", employeeId } = req.body;
    if (!fullName || !email || !password || !department || !designation || !employeeId) {
      return res.status(400).json({ message: "Full name, email, password, employee ID, department, and designation are required" });
    }
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.create({ name: fullName, email: normalizedEmail, password, role: "employee" });
    try {
      const employee = await Employee.create({
        user: user._id, employeeId, fullName, email: normalizedEmail, phone, department, designation,
        joiningDate: joiningDate || new Date(), employmentStatus
      });
      user.employee = employee._id;
      await user.save();
      res.status(201).json({ employee });
    } catch (err) {
      await User.findByIdAndDelete(user._id);
      throw err;
    }
  } catch (err) { next(err); }
}

export async function updateEmployee(req, res, next) {
  try {
    const allowed = ["fullName", "email", "phone", "department", "designation", "joiningDate", "employmentStatus", "employeeId"];
    const updates = {};
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
    if (updates.email) updates.email = String(updates.email).trim().toLowerCase();
    const employee = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    await User.findByIdAndUpdate(employee.user, { name: employee.fullName, email: employee.email });
    res.json({ employee });
  } catch (err) { next(err); }
}

export async function deleteEmployee(req, res, next) {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    if (employee.profileImage?.filename) {
      const filePath = path.resolve("uploads", path.basename(employee.profileImage.filename));
      fs.promises.unlink(filePath).catch(() => {});
    }
    await User.findByIdAndDelete(employee.user);
    await employee.deleteOne();
    res.json({ message: "Employee deleted successfully" });
  } catch (err) { next(err); }
}

export async function myProfile(req, res, next) {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: "Employee profile not found" });
    res.json({ employee });
  } catch (err) { next(err); }
}

export async function updateMyProfile(req, res, next) {
  try {
    const allowed = ["phone"];
    const updates = {};
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
    const employee = await Employee.findOneAndUpdate({ user: req.user._id }, updates, { new: true, runValidators: true });
    if (!employee) return res.status(404).json({ message: "Employee profile not found" });
    res.json({ employee });
  } catch (err) { next(err); }
}

export async function updateProfileImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "Choose an image file first" });
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      await fs.promises.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ message: "Employee profile not found" });
    }
    if (employee.profileImage?.filename) {
      const oldPath = path.resolve("uploads", path.basename(employee.profileImage.filename));
      await fs.promises.unlink(oldPath).catch(() => {});
    }
    employee.profileImage = { filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size };
    await employee.save();
    res.json({ employee });
  } catch (err) { next(err); }
}
