import React, { useState } from "react";
import { Row, Col, Container, Form, Image } from "react-bootstrap";
import { loginUser } from "../../../services/auth-service";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import googleLogo from "../../../assets/LoginImage/google_logo.png";
import illustationPhoto from "../../../assets/LoginImage/loginphoto1.png";
import worktraceLogo from "../../../assets/images/worktrace-logo.svg";
import styles from "./LoginForm.module.css";

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
      localStorage.setItem("user", JSON.stringify(userData.user));
      sessionStorage.setItem("token", userData.token);
      // Chuyển hướng sau khi đăng nhập
      if (userData.user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["login-page"]}>
      <Container>
        <Row>
          <Col sm={6} className="d-flex flex-column">
            <img
              src={worktraceLogo}
              alt="WorkTrace Logo"
              className={styles["logo"]}
            />

            <Form className={styles["login-form"]} onSubmit={handleSubmit}>
              <h1 className="mb-4">Login</h1>
              <p>Hi, Welcome 👋</p>

              {/* Email */}
              <Form.Group className="mb-3 mt-4" controlId="Email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3" controlId="Password">
                <Form.Label>Password</Form.Label>
                <div className={styles["showpass"]}>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className={styles["toggle-password"]}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </Form.Group>

              <div className={styles["form-options"]}>
                <label className={styles["remember-label"]}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Remember Me
                </label>
                <a href="#" className={styles["forgot-link"]}>
                  Forgot Password?
                </a>
              </div>

              {error && <p className="text-danger">{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className={styles["signup-link"]}>
                Not registered yet? <a href="/register">Create an account</a>
              </p>

              <div className={styles["divider"]}>or Login with Google</div>

              <button type="button" className={styles["google-button"]}>
                <img src={googleLogo} alt="Google" /> Login with Google
              </button>
            </Form>
          </Col>
          {/* Image */}
          <Col
            sm={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Image className="w-100" src={illustationPhoto} rounded />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginForm;
