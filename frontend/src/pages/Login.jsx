import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

export default function Login() {
  const [mode, setMode] = useState(null); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("USER");
  const [adminKey, setAdminKey] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  //  REGISTER
  const register = async () => {
    try {
      await API.post("/api/auth/register", {
        username,
        email,
        password,
        role,
        adminKey,
      });

      alert("Registered Successfully");
      setMode("login"); // auto switch to login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Register Failed");
    }
  };

  //  LOGIN
  const login = async () => {
    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login Success!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
    }
  };

  return (
    <>
      <div className="login-navbar">
        <div className="brand">EventZen</div>
      </div>

      <div className="login-container">

        <div className="login-welcome">
          <h1 className="login-welcome-text">
            <span className="login-welcome-light">Welcome to </span>
            <span className="login-welcome-brand">EventZen</span>
          </h1>
        </div>

        {!mode && (
          <div className="auth-choice">
            <button onClick={() => setMode("login")} className="login-btn">
              Login
            </button>

            <button onClick={() => setMode("register")} className="register-btn">
              Register
            </button>
          </div>
        )}

        {/*  LOGIN FORM */}
        {mode === "login" && (
          <div className="login-card">
            <h2>Login</h2>

            <div className="form-group">
              <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="form-login-btn" onClick={login}>
              Login
            </button>
          </div>
        )}

        {/*  REGISTER FORM */}
        {mode === "register" && (
          <div className="login-card">
            <h2>Register</h2>

            <div className="form-group">
              <input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><b>Role:</b></label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setAdminKey("");
                }}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/*  ADMIN KEY */}
            {role === "ADMIN" && (
              <div className="form-group">
                <input
                  placeholder="Admin Secret Key"
                  onChange={(e) => setAdminKey(e.target.value)}
                />
              </div>
            )}

            <button className="form-register-btn" onClick={register}>
              Register
            </button>
          </div>
        )}

        {/*  BACK BUTTON */}
        {mode && (
          <button className="back-auth" onClick={() => setMode(null)}>
            ← Back
          </button>
        )}
      </div>
    </>
  );
}
