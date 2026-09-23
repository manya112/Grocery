import express from "express";
import { check } from "express-validator";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Validation rules for Registration
const registerValidation = [
    check("name", "Name is required").notEmpty().trim(),
    check("email", "Please provide a valid email address").isEmail().normalizeEmail(),
    check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
];

// Validation rules for Login
const loginValidation = [
    check("email", "Please provide a valid email address").isEmail().normalizeEmail(),
    check("password", "Password is required").notEmpty(),
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerValidation, registerUser);

// @route   POST /api/auth/login
// @desc    Login user & get JWT token
// @access  Public
router.post("/login", loginValidation, loginUser);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get("/me", protect, getMe);

export default router;
