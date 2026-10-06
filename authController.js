import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import mongoose from "mongoose";

// In-memory fallback store if MongoDB Atlas / local DB is unavailable
const memoryUserStore = [];

// Helper function to generate JWT token
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || "harvestly_super_secret_jwt_key_2026",
        { expiresIn: "30d" }
    );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg,
            errors: errors.array(),
        });
    }

    const { name, email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
        try {
            const userExists = await User.findOne({ email: cleanEmail });
            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists with this email address",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                name,
                email: cleanEmail,
                password: hashedPassword,
            });

            console.log(`✅ MongoDB User Created: ${user.name} (${user.email}) - ID: ${user._id}`);

            const token = generateToken(user._id, user.role);
            return res.status(201).json({
                success: true,
                message: "User registered successfully in MongoDB",
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error(`❌ MongoDB Register Exception: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: `Database Error: ${error.message}`,
            });
        }
    } else {
        console.warn(`⚠️ MongoDB not connected (readyState: ${mongoose.connection.readyState}). Using memory store fallback.`);
    }

    // Fallback: In-memory store
    const existing = memoryUserStore.find(u => u.email === cleanEmail);
    if (existing) {
        return res.status(400).json({
            success: false,
            message: "User already exists with this email address",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
        _id: "mem_" + Date.now(),
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: "user",
    };
    memoryUserStore.push(newUser);

    const token = generateToken(newUser._id, newUser.role);
    return res.status(201).json({
        success: true,
        message: "User registered successfully (In-Memory)",
        token,
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
    });
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get JWT token
// @access  Public
export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg,
            errors: errors.array(),
        });
    }

    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // Try MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
        try {
            const user = await User.findOne({ email: cleanEmail });
            if (user && (await user.matchPassword(password))) {
                const token = generateToken(user._id, user.role);
                return res.status(200).json({
                    success: true,
                    message: "Logged in successfully via MongoDB",
                    token,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                });
            }
        } catch (error) {
            console.error(`❌ MongoDB Login Error: ${error.message}`);
        }
    }

    // Fallback: In-memory store
    const memUser = memoryUserStore.find(u => u.email === cleanEmail);
    if (memUser && (await bcrypt.compare(password, memUser.password))) {
        const token = generateToken(memUser._id, memUser.role);
        return res.status(200).json({
            success: true,
            message: "Logged in successfully (In-Memory)",
            token,
            user: {
                _id: memUser._id,
                name: memUser.name,
                email: memUser.email,
                role: memUser.role,
            },
        });
    }

    return res.status(401).json({
        success: false,
        message: "Invalid email or password",
    });
};

// @route   GET /api/auth/me
// @desc    Get current authenticated user profile
// @access  Private
export const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        console.error(`GetMe Controller Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error fetching user profile",
        });
    }
};
