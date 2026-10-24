import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  employeeId: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: "", trim: true },
  department: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  joiningDate: { type: Date, default: Date.now },
  employmentStatus: { type: String, enum: ["Active", "Inactive", "On Leave"], default: "Active" },

  profileImage: {
    filename: { type: String, default: "" },
    mimetype: { type: String, default: "" },
    size: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);
