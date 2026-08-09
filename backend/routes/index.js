import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { login, getMe, getAdmins, createAdmin, updateAdmin, deleteAdmin, getPublicAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  getProjects, getProject, addReview,
  createProject, updateProject, deleteProject,
  deleteReview, toggleReviewApproval,
} from '../controllers/projectController.js';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skillController.js';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../controllers/experienceController.js';
import { submitContact } from '../controllers/contactController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, jpeg, png, webp, gif) are allowed!'));
  }
});

const router = Router();

// ── Auth ──────────────────────────────────────────────
router.post('/auth/login', login);
router.get('/auth/public-admin', getPublicAdmin);
router.get('/auth/me', protect, getMe);
router.get('/auth/admins', protect, getAdmins);
router.post('/auth/admins', protect, createAdmin);
router.put('/auth/admins/:id', protect, updateAdmin);
router.delete('/auth/admins/:id', protect, deleteAdmin);

// ── File Upload ──────────────────────────────────────
router.post('/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ── Projects (public) ─────────────────────────────────
router.get('/projects', getProjects);
router.get('/projects/:id', getProject);
router.post('/projects/:id/reviews', addReview);
router.post('/contact', submitContact);

// ── Projects (admin) ─────────────────────────────────
router.post('/projects', protect, createProject);
router.put('/projects/:id', protect, updateProject);
router.delete('/projects/:id', protect, deleteProject);
router.delete('/projects/:id/reviews/:reviewId', protect, deleteReview);
router.patch('/projects/:id/reviews/:reviewId/toggle', protect, toggleReviewApproval);

// ── Skills ────────────────────────────────────────────
router.get('/skills', getSkills);
router.post('/skills', protect, createSkill);
router.put('/skills/:id', protect, updateSkill);
router.delete('/skills/:id', protect, deleteSkill);

// ── Experience / Education ────────────────────────────
router.get('/experiences', getExperiences);
router.post('/experiences', protect, createExperience);
router.put('/experiences/:id', protect, updateExperience);
router.delete('/experiences/:id', protect, deleteExperience);

export default router;
