import React, { useState } from "react";
import {
  Row,
  Col,
  Container,
  Form,
  Button,
  Image,
  InputGroup,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import illustationPhoto from "../../assets/LoginImage/loginphoto1.png";
import "./RegisterForm.css";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="register_page">
      <Container>
        <Row>
          <Col sm={6} className="d-flex flex-column">
            <h2 className="logo">Name of website</h2>
            <Form className="register-form">
              <h1 className="mb-4">Sign Up</h1>

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

              {/* Username */}
              <Form.Group className="mb-3" controlId="Username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Role */}
              <Form.Group className="mb-3" controlId="Role">
                <Form.Label>Role</Form.Label>
                <Form.Select>
                  <option>Permissions</option>
                  <option value="1">User</option>
                  <option value="2">Admin</option>
                  <option value="3">Teacher</option>
                </Form.Select>
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3" controlId="Password">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
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
                </InputGroup>
              </Form.Group>

              {/* Confirm Password */}
              <Form.Group className="mb-3" controlId="ConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </InputGroup>
              </Form.Group>

              {/* Submit */}
              <Form.Group className="mt-4 text-center">
                <Button className="w-100">Register</Button>
                <p className="text-center mt-3">
                  Already have an account?{" "}
                  <a href="/signup">
                    <b className="text-primary">Login</b>
                  </a>
                </p>
              </Form.Group>
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
};

export default RegisterForm;
