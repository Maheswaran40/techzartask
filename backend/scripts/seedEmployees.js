
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
});

import User from "../models/User.js";
import Employee from "../models/Employee.js";
import { connectDB } from "../config/db.js";

const employees = [
    {
        employeeId: "EMP001",
        fullName: "Arun Kumar",
        email: "arun.kumar@example.com",
        password: "Arun@Demo2026!",
        phone: "9876543210",
        department: "Development",
        designation: "MERN Stack Developer",
        joiningDate: new Date("2025-06-10"),
        employmentStatus: "Active",
    },
    {
        employeeId: "EMP002",
        fullName: "Priya Sharma",
        email: "priya.sharma@example.com",
        password: "Priya@Demo2026!",
        phone: "9876501234",
        department: "Design",
        designation: "UI/UX Designer",
        joiningDate: new Date("2025-08-15"),
        employmentStatus: "Active",
    },
    {
        employeeId: "EMP003",
        fullName: "Vignesh Raj",
        email: "vignesh.raj@example.com",
        password: "Vignesh@Demo2026!",
        phone: "9123456780",
        department: "Development",
        designation: "Frontend Developer",
        joiningDate: new Date("2025-09-01"),
        employmentStatus: "Active",
    },
    {
        employeeId: "EMP004",
        fullName: "Divya Lakshmi",
        email: "divya.lakshmi@example.com",
        password: "Divya@Demo2026!",
        phone: "9012345678",
        department: "Human Resources",
        designation: "HR Executive",
        joiningDate: new Date("2024-11-20"),
        employmentStatus: "On Leave",
    },
    {
        employeeId: "EMP005",
        fullName: "Karthik S",
        email: "karthik.s@example.com",
        password: "Karthik@Demo2026!",
        phone: "9988776655",
        department: "Marketing",
        designation: "Digital Marketing Executive",
        joiningDate: new Date("2026-01-05"),
        employmentStatus: "Active",
    },
];


async function seedEmployees() {
  try {
    await connectDB();

    for (const data of employees) {
      // Check whether the employee profile already exists
      const existingEmployee = await Employee.findOne({
        $or: [
          { email: data.email },
          { employeeId: data.employeeId },
        ],
      });

      if (existingEmployee) {
        console.log(`Skipped existing employee: ${data.email}`);
        continue;
      }

      // Find the existing login account
      let user = await User.findOne({
        email: data.email,
      });

      let createdUser = false;

      if (user) {
        // Update password for an existing login account
        user.password = data.password;
        user.role = "employee";
        await user.save();

        console.log(`Existing user updated: ${data.email}`);
      } else {
        // Create a new login account
        user = await User.create({
          name: data.fullName,
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          role: "employee",
        });

        createdUser = true;
        console.log(`User created: ${data.email}`);
      }

      try {
        // Create the employee profile
        await Employee.create({
          user: user._id,
          employeeId: data.employeeId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          department: data.department,
          designation: data.designation,
          joiningDate: data.joiningDate,
          employmentStatus: data.employmentStatus,
        });

        console.log(`Employee created: ${data.fullName}`);
      } catch (error) {
        // Roll back a newly created login account if profile creation fails
        if (createdUser) {
          await User.findByIdAndDelete(user._id);
        }

        throw error;
      }
    }

    console.log("Employee seeding completed.");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedEmployees();


