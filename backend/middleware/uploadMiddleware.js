import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const uploadDir = path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  }
});

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
function fileFilter(_req, file, cb) {
  if (!allowed.has(file.mimetype)) return cb(Object.assign(new Error("Only JPEG, PNG, and WebP images are allowed"), { status: 415 }));
  cb(null, true);
}

export const uploadProfileImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }
}).single("profileImage");
