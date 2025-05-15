import React, { useState } from "react";
import { loginUser } from "../../services/auth-service";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import googleLogo from "../../assets/LoginImage/google_logo.png";
import illustationPhoto from "../../assets/LoginImage/loginphoto1.png";
import "./LoginForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await loginUser({ email, password });
      console.log("Đăng nhập thành công:", userData);

      if (rememberMe) {
        localStorage.setItem("token", userData.token);
      } else {
        sessionStorage.setItem("token", userData.token);
      }

      // Chuyển hướng sau khi đăng nhập
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h2 className="logo">WorkTrace</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <p>Hi, Welcome 👋</p>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="form-options">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="signup-link">
            Not registered yet?{" "}
            <a href="/signup">
              Create an account <b>SignUp</b>
            </a>
          </p>

          <div className="divider">or Login with Google</div>

          <button type="button" className="google-button">
            <img src={googleLogo} alt="Google" /> Login with Google
          </button>
        </form>
      </div>

      <div className="illustration">
        <img src={illustationPhoto} alt="illustration" />
      </div>
    </div>
  );
}

export default LoginForm;
