import { Router } from "express";
import {
  listEmployees, dashboardStats, getEmployee, createEmployee, updateEmployee, deleteEmployee,
  myProfile, updateMyProfile, updateProfileImage
} from "../controllers/employeeController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { uploadProfileImage } from "../middleware/uploadMiddleware.js";

const router = Router();
router.use(requireAuth);

router.get("/me/profile", requireRole("employee"), myProfile);
router.patch("/me/profile", requireRole("employee"), updateMyProfile);
router.post("/me/profile-image", requireRole("employee"), (req, res, next) => {
  uploadProfileImage(req, res, (err) => err ? next(err) : next());
}, updateProfileImage);

router.get("/stats", requireRole("admin"), dashboardStats);
router.get("/", requireRole("admin"), listEmployees);
router.post("/", requireRole("admin"), createEmployee);
router.get("/:id", requireRole("admin"), getEmployee);
router.put("/:id", requireRole("admin"), updateEmployee);
router.delete("/:id", requireRole("admin"), deleteEmployee);
export default router;
