import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield, Sparkles, ArrowLeft, KeyRound } from "lucide-react";

type AuthView = "login" | "signup" | "forgot" | "otp" | "reset";

export function AuthPage() {
  const { login, signup, forgotPassword, verifyOtp, resetPassword } = useAuth();
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearState = () => {
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) setError(result.error || "Login failed");
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const result = await signup(name, email, password);
    if (!result.success) setError(result.error || "Signup failed");
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();
    setLoading(true);
    const result = await forgotPassword(email);
    if (result.success) {
      setSuccess(result.message || "OTP sent!");
      setView("otp");
    } else {
      setError(result.error || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    setLoading(true);
    const result = await verifyOtp(email, otpString);
    if (result.success) {
      setSuccess("OTP verified! Redirecting...");
      // The AuthContext will auto-login; no need to switch views
    } else {
      setError(result.error || "Invalid OTP");
    }
    setLoading(false);
  };

  const switchView = (newView: AuthView) => {
    clearState();
    setView(newView);
    if (newView === "otp") {
      setOtp(["", "", "", "", "", ""]);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background */}
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
        <div className="auth-bg-orb auth-bg-orb-3" />
        <div className="auth-bg-grid" />
      </div>

      <div className={`auth-container ${mounted ? "auth-mounted" : ""}`}>
        {/* Left Panel — Branding */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-badge">
              <Shield className="auth-brand-icon" />
            </div>
            <h1 className="auth-brand-title">CivicAI</h1>
            <p className="auth-brand-subtitle">ग्रामीण सहायक • Rural Assistant</p>
            <div className="auth-brand-divider" />
            <p className="auth-brand-desc">
              Empowering rural India with AI-powered governance assistance, real-time job alerts, and multi-language support.
            </p>
            <div className="auth-brand-features">
              <div className="auth-feature">
                <Sparkles size={16} />
                <span>AI-Powered Assistance</span>
              </div>
              <div className="auth-feature">
                <Mail size={16} />
                <span>10+ Indian Languages</span>
              </div>
              <div className="auth-feature">
                <KeyRound size={16} />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
          <p className="auth-brand-footer">© 2026 CivicAI — Built for Bharat 🇮🇳</p>
        </div>

        {/* Right Panel — Auth Forms */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            {/* ────── LOGIN ────── */}
            {view === "login" && (
              <div className="auth-form-block" key="login">
                <div className="auth-form-header">
                  <h2 className="auth-form-title">Welcome Back</h2>
                  <p className="auth-form-subtitle">Sign in to continue to CivicAI</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                  <div className="auth-input-group">
                    <label htmlFor="login-email">Email Address</label>
                    <div className="auth-input-wrap">
                      <Mail size={18} className="auth-input-icon" />
                      <input
                        id="login-email"
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label htmlFor="login-password">Password</label>
                    <div className="auth-input-wrap">
                      <Lock size={18} className="auth-input-icon" />
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="auth-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="auth-forgot-link"
                    onClick={() => switchView("forgot")}
                  >
                    Forgot Password?
                  </button>

                  {error && <div className="auth-error">{error}</div>}
                  {success && <div className="auth-success">{success}</div>}

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? (
                      <span className="auth-spinner" />
                    ) : (
                      <>
                        Sign In <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <p className="auth-switch-text">
                  Don't have an account?{" "}
                  <button onClick={() => switchView("signup")} className="auth-switch-btn">
                    Create Account
                  </button>
                </p>
              </div>
            )}

            {/* ────── SIGNUP ────── */}
            {view === "signup" && (
              <div className="auth-form-block" key="signup">
                <div className="auth-form-header">
                  <h2 className="auth-form-title">Create Account</h2>
                  <p className="auth-form-subtitle">Join CivicAI — only Gmail accounts accepted</p>
                </div>

                <form onSubmit={handleSignup} className="auth-form">
                  <div className="auth-input-group">
                    <label htmlFor="signup-name">Full Name</label>
                    <div className="auth-input-wrap">
                      <User size={18} className="auth-input-icon" />
                      <input
                        id="signup-name"
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label htmlFor="signup-email">Gmail Address</label>
                    <div className="auth-input-wrap">
                      <Mail size={18} className="auth-input-icon" />
                      <input
                        id="signup-email"
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label htmlFor="signup-password">Password</label>
                    <div className="auth-input-wrap">
                      <Lock size={18} className="auth-input-icon" />
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="auth-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && <div className="auth-error">{error}</div>}
                  {success && <div className="auth-success">{success}</div>}

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? (
                      <span className="auth-spinner" />
                    ) : (
                      <>
                        Create Account <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <p className="auth-switch-text">
                  Already have an account?{" "}
                  <button onClick={() => switchView("login")} className="auth-switch-btn">
                    Sign In
                  </button>
                </p>
              </div>
            )}

            {/* ────── FORGOT PASSWORD ────── */}
            {view === "forgot" && (
              <div className="auth-form-block" key="forgot">
                <button className="auth-back-btn" onClick={() => switchView("login")}>
                  <ArrowLeft size={18} /> Back to Login
                </button>

                <div className="auth-form-header">
                  <h2 className="auth-form-title">Forgot Password</h2>
                  <p className="auth-form-subtitle">
                    Enter your registered Gmail and we'll send you a one-time password (OTP)
                  </p>
                </div>

                <form onSubmit={handleForgot} className="auth-form">
                  <div className="auth-input-group">
                    <label htmlFor="forgot-email">Gmail Address</label>
                    <div className="auth-input-wrap">
                      <Mail size={18} className="auth-input-icon" />
                      <input
                        id="forgot-email"
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {error && <div className="auth-error">{error}</div>}
                  {success && <div className="auth-success">{success}</div>}

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? (
                      <span className="auth-spinner" />
                    ) : (
                      <>
                        Send OTP <Mail size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ────── OTP VERIFICATION ────── */}
            {view === "otp" && (
              <div className="auth-form-block" key="otp">
                <button className="auth-back-btn" onClick={() => switchView("forgot")}>
                  <ArrowLeft size={18} /> Back
                </button>

                <div className="auth-form-header">
                  <div className="auth-otp-mail-icon">
                    <Mail size={32} />
                  </div>
                  <h2 className="auth-form-title">Enter OTP</h2>
                  <p className="auth-form-subtitle">
                    We've sent a 6-digit code to <strong>{email}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="auth-form">
                  <div className="auth-otp-container" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="auth-otp-input"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  {error && <div className="auth-error">{error}</div>}
                  {success && <div className="auth-success">{success}</div>}

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? (
                      <span className="auth-spinner" />
                    ) : (
                      <>
                        Verify & Login <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="auth-resend-btn"
                    onClick={() => {
                      clearState();
                      handleForgot({ preventDefault: () => {} } as React.FormEvent);
                    }}
                  >
                    Didn't receive it? <span>Resend OTP</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
