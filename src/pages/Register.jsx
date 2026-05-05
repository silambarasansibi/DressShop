import React, { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔥 toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "", // success | error
  });

  // ---------------- TOAST ----------------
  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      showToast("All fields are required", "error");
      return;
    }

    setLoading(true);

    try {
      await registerUser(form);

      showToast("Account created successfully 🎉", "success");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed";

      // 🔥 SHOW EXACT BACKEND ERROR
      showToast(message, "error");

      console.log("REGISTER ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* 🔥 TOP TOAST NOTIFICATION */}
      {toast.show && (
        <div
          style={{
            ...styles.toast,
            background:
              toast.type === "success" ? "#4CAF50" : "#f44336",
          }}
        >
          {toast.message}
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.title}>Create Account 🚀</h2>
        <p style={styles.subtitle}>
          Join and start exploring products
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={form.name}
            style={styles.input}
          />

          <input
            name="email"
            placeholder="Email Address"
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
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
    fontFamily: "Arial",
    position: "relative",
  },

  card: {
    width: "360px",
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

  /* 🔥 TOAST STYLE */
  toast: {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
    zIndex: 9999,
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
};

export default Register;