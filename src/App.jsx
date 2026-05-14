import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// ---------------- NAVBAR ----------------
const Navbar = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setIsAuth(false);
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      {!isAuth ? (
        <div style={styles.links}>
          <Link to="/">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      ) : (
        <div style={styles.links}>
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={handleLogout} style={styles.btn}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------- MAIN APP ----------------
function App() {
  const [isAuth, setIsAuth] = useState(false);

  // 🔥 FIX 1: load auth properly on refresh
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuth(!!token);
  }, []);

  // 🔥 FIX 2: proper login handler (NO token override)
  const handleLogin = () => {
    const token = localStorage.getItem("accessToken");
    setIsAuth(!!token);
  };

  // 🔥 FIX 3: auto sync if storage changes (optional but good)
  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuth(!!token);
    };

    window.addEventListener("storage", syncAuth);

    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <Router>
      <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />

      <Routes>
        <Route
          path="/"
          element={
            isAuth ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            isAuth ? <Dashboard /> : <Navigate to="/" replace />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// ---------------- STYLES ----------------
const styles = {
  navbar: {
    padding: "10px",
    background: "#111",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  btn: {
    padding: "6px 12px",
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
};
console.log("updated github");

export default App;