/**
 * Auth Router — Signup, Login, Forgot Password with OTP
 * Uses JSON-file storage, bcrypt for passwords, Nodemailer for OTP emails.
 * Only allows @gmail.com addresses.
 */
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const USERS_FILE = path.join(__dirname, "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "civicai_secret_key_2026";
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// ─── Helpers ─────────────────────────────────────────────

function loadUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function isGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email);
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// In-memory OTP store  { email: { otp, expiresAt } }
const otpStore = {};

// ─── Nodemailer Transporter ──────────────────────────────

function getTransporter() {
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS;

  console.log(`[Mail] Configuring transporter for: ${mailUser ? mailUser : "⚠️ MAIL_USER NOT SET"}`);

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for 587 (STARTTLS)
    auth: {
      user: mailUser,
      pass: mailPass, // Must be a Gmail App Password (16 chars, no spaces)
    },
    tls: {
      rejectUnauthorized: false, // Helps avoid certificate issues on some systems
    },
  });
}

async function sendOTPEmail(toEmail, otp) {
  // Always log OTP to console as fallback
  console.log(`\n╔══════════════════════════════════════╗`);
  console.log(`║  📧 OTP for ${toEmail}`);
  console.log(`║  🔑 OTP Code: ${otp}`);
  console.log(`║  ⏰ Expires in 5 minutes`);
  console.log(`╚══════════════════════════════════════╝\n`);

  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS;

  // Check if mail credentials are configured
  if (!mailUser || !mailPass || mailUser === "your_gmail@gmail.com" || mailPass === "your_gmail_app_password") {
    console.warn("[Mail] ⚠️  MAIL_USER / MAIL_PASS not configured in .env — OTP printed to console only.");
    console.warn("[Mail] To enable email OTP, set MAIL_USER and MAIL_PASS (Gmail App Password) in .env");
    return; // Don't throw — OTP is in console, let the flow continue
  }

  try {
    const transporter = getTransporter();

    // Verify connection first
    await transporter.verify();
    console.log("[Mail] ✅ SMTP connection verified");

    const mailOptions = {
      from: `"CivicAI" <${mailUser}>`,
      to: toEmail,
      subject: "🔐 CivicAI — Password Reset OTP",
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif; max-width:480px; margin:0 auto; background:linear-gradient(135deg,#fff7ed,#fff); border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <div style="background:linear-gradient(135deg,#ea580c,#f97316); padding:32px 24px; text-align:center;">
            <h1 style="color:#fff; margin:0; font-size:28px; letter-spacing:1px;">CivicAI</h1>
            <p style="color:#fed7aa; margin:8px 0 0; font-size:14px;">ग्रामीण सहायक • Rural Assistant</p>
          </div>
          <div style="padding:32px 24px; text-align:center;">
            <p style="color:#78716c; font-size:15px; margin:0 0 24px;">Use this One-Time Password to reset your password:</p>
            <div style="background:#fff7ed; border:2px dashed #fb923c; border-radius:12px; padding:20px; display:inline-block;">
              <span style="font-size:36px; font-weight:700; letter-spacing:12px; color:#ea580c;">${otp}</span>
            </div>
            <p style="color:#a8a29e; font-size:13px; margin:24px 0 0;">This code expires in <strong>5 minutes</strong>.</p>
            <p style="color:#a8a29e; font-size:12px; margin:16px 0 0;">If you didn't request this, ignore this email.</p>
          </div>
          <div style="background:#fafaf9; padding:16px 24px; text-align:center; border-top:1px solid #e7e5e4;">
            <p style="color:#d6d3d1; font-size:11px; margin:0;">© 2026 CivicAI — Empowering Rural India</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Mail] ✅ OTP email sent! Message ID: ${info.messageId}`);
  } catch (mailErr) {
    console.error(`[Mail] ❌ Failed to send email: ${mailErr.message}`);
    console.error(`[Mail] Full error:`, mailErr);
    console.warn("[Mail] ⚠️  OTP was printed to console above — use it from there.");
    // Don't throw — the OTP is logged to console, flow should continue
  }
}

// ─── Routes ──────────────────────────────────────────────

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    if (!isGmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email! Only Google (Gmail) registered emails are accepted.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    }

    const users = loadUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, error: "An account with this email already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("[Auth] Signup error:", err.message);
    console.error("[Auth] Signup stack:", err.stack);
    res.status(500).json({ success: false, error: "Server error during signup: " + err.message });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    if (!isGmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email! Only Google (Gmail) registered emails are accepted.",
      });
    }

    const users = loadUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, error: "No account found with this email. Please sign up." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: "Incorrect password. Try again." });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("[Auth] Login error:", err.message);
    res.status(500).json({ success: false, error: "Server error during login" });
  }
});

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 * Sends an OTP to the registered email
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    if (!isGmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email! Only Google (Gmail) registered emails are accepted.",
      });
    }

    const users = loadUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ success: false, error: "No account found with this email." });
    }

    const otp = generateOTP();
    otpStore[email.toLowerCase()] = {
      otp,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
    };

    await sendOTPEmail(email, otp);

    res.json({ success: true, message: "OTP sent to your email successfully!" });
  } catch (err) {
    console.error("[Auth] Forgot password error:", err.message);
    res.status(500).json({ success: false, error: "Failed to send OTP. Please try again." });
  }
});

/**
 * POST /api/auth/verify-otp
 * Body: { email, otp }
 * Verifies OTP and returns a JWT token (auto-login)
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: "Email and OTP are required" });
    }

    const stored = otpStore[email.toLowerCase()];
    if (!stored) {
      return res.status(400).json({ success: false, error: "No OTP request found. Please request a new OTP." });
    }

    if (Date.now() > stored.expiresAt) {
      delete otpStore[email.toLowerCase()];
      return res.status(400).json({ success: false, error: "OTP has expired. Please request a new one." });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ success: false, error: "Invalid OTP. Please try again." });
    }

    // OTP verified — clean up and auto-login
    delete otpStore[email.toLowerCase()];

    const users = loadUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "OTP verified! You are logged in.",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("[Auth] Verify OTP error:", err.message);
    res.status(500).json({ success: false, error: "Server error during OTP verification" });
  }
});

/**
 * POST /api/auth/reset-password
 * Body: { email, newPassword }
 * Resets password (call after OTP verification)
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, error: "Email and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    }

    const users = loadUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    users[userIndex].password = await bcrypt.hash(newPassword, 10);
    saveUsers(users);

    const user = users[userIndex];
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Password reset successfully!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("[Auth] Reset password error:", err.message);
    res.status(500).json({ success: false, error: "Server error during password reset" });
  }
});

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 * Returns current user info
 */
router.get("/me", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      success: true,
      user: { id: decoded.id, name: decoded.name, email: decoded.email },
    });
  } catch (err) {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
});

export default router;
