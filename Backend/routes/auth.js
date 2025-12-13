const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

/* =====================
   SIGNUP
===================== */
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ msg: "All fields required" });

        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ msg: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);

        await User.create({ email, password: hashed });

        res.json({ msg: "Signup successful" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

/* =====================
   SIGNIN
===================== */
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ msg: "Signin successful", token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

/* =====================
   FORGOT PASSWORD
===================== */
router.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: "User not found" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const resetUrl =
            `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await sendEmail(email, "Reset Your Password", resetUrl);

        res.json({ msg: "Password reset email sent" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

/* =====================
   RESET PASSWORD
===================== */
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password)
            return res.status(400).json({ msg: "Invalid request" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const hashed = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(decoded.id, {
            password: hashed
        });

        res.json({ msg: "Password reset successful" });

    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: "Invalid or expired token" });
    }
});

module.exports = router;
