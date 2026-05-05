import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and Password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser(form);

      // 🔥 SAFE TOKEN EXTRACTION (VERY IMPORTANT)
      const token =
        res?.accessToken ||
        res?.token ||
        res?.data?.accessToken ||
        res?.data?.token;

      const user =
        res?.user ||
        res?.data?.user ||
        {};

      console.log("LOGIN RESPONSE:", res);
      console.log("TOKEN:", token);

      if (!token) {
        setError("Login failed: token not received from backend");
        return;
      }

      // ✅ STORE REAL TOKEN ONLY
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (onLogin) onLogin();

      navigate("/dashboard");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      setError(
        err?.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to continue shopping</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            value={form.email}
            style={styles.input}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            style={styles.input}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
    fontFamily: "Arial",
  },

  card: {
    width: "350px",
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  title: {
    color: "#2196f3",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  button: {
    padding: "12px",
    background: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px",
  },

  footer: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#555",
  },

  link: {
    color: "#2196f3",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

export default Login;