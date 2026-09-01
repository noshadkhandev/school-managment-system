import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, LogIn } from "lucide-react";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = localStorage.getItem("adminLoggedIn");

  if (isLoggedIn === "true") {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (
        email === "jawad09@gmail.com" &&
        password === "jawad123"
      ) {
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminEmail", email);

        navigate("/admin", { replace: true });
      } else {
        setError("Invalid email or password.");
      }

      setLoading(false);
    }, 700);
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>

      <div className="login-container">

        <div className="login-brand">
          <div className="login-logo">SP</div>

          <div>
            <h2>Student Portal</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <div className="login-card">

          <div className="login-heading">
            <h1>Welcome Back</h1>

            <p>
              Sign in to access your admin dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="login-field">
              <label>Email Address</label>

              <div className="login-input">
                <Mail size={19} />

                <input
                  type="email"
                  placeholder="jawad09@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="login-field">
              <label>Password</label>

              <div className="login-input">
                <LockKeyhole size={19} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner"></span>
              ) : (
                <>
                  <LogIn size={18} />
                  Login
                </>
              )}
            </button>

          </form>

          <div className="login-demo">
            <span>Demo Credentials</span>

            <strong>
              jawad09@gmail.com
            </strong>

            <strong>
              Password: jawad123
            </strong>
          </div>

        </div>

        <p className="login-footer">
          © 2026 Student Portal. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Login;

