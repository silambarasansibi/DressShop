import React, { useEffect, useState } from "react";
import { getProducts, getFeedback, postFeedback } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [form, setForm] = useState({
    productId: "",
    rating: "",
    title: "",
    comment: "",
  });

  // AUTH
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || token === "true" || token === "undefined") {
      navigate("/");
    }
  }, [navigate]);

  // LOAD DATA
  const loadData = async () => {
    try {
      const [p, f] = await Promise.all([getProducts(), getFeedback()]);
      setProducts(Array.isArray(p) ? p : []);
      setFeedbacks(Array.isArray(f) ? f : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // FORM
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SELECT PRODUCT
  const handleSelectProduct = (p) => {
    setSelectedProduct(p);
    setForm({ ...form, productId: p.id || p._id });
  };

  // SUBMIT
  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.rating || !form.title || !form.comment) {
      alert("Fill all fields");
      return;
    }

    try {
      await postFeedback({
        ...form,
        rating: Number(form.rating),
      });

      setForm({ productId: "", rating: "", title: "", comment: "" });
      loadData();
    } catch (err) {
      alert("Error submitting feedback");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = feedbacks.slice(start, start + itemsPerPage);

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2>🛍️ Shop Dashboard</h2>
        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>

      <div style={styles.container}>

        {/* PRODUCTS */}
        <div style={styles.box}>
          <h3>Products</h3>

          <div style={styles.scroll}>
            {products.map((p) => (
              <div key={p.id || p._id} style={styles.card}>
                <h4>{p.name}</h4>
                <p>₹ {p.price}</p>

                <button
                  style={styles.btn}
                  onClick={() => handleSelectProduct(p)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>

          {/* SELECTED PRODUCT DISPLAY */}
          <div style={styles.selectedBox}>
            <h4>Selected Product</h4>

            {selectedProduct ? (
              <div>
                <b>{selectedProduct.name}</b>
                <p>₹ {selectedProduct.price}</p>
              </div>
            ) : (
              <p>No product selected</p>
            )}
          </div>
        </div>

        {/* FEEDBACK */}
        <div style={styles.box}>
          <h3>Submit Feedback</h3>

          <form onSubmit={submitFeedback} style={styles.form}>
            <input
              name="productId"
              placeholder="Product ID"
              value={form.productId}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="rating"
              placeholder="Rating (1-5)"
              value={form.rating}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="comment"
              placeholder="Comment"
              value={form.comment}
              onChange={handleChange}
              style={styles.input}
            />

            <button type="submit" style={styles.submit}>
              Submit Feedback
            </button>
          </form>

          <h3>Feedbacks</h3>

          <div style={styles.scroll}>
            {currentFeedbacks.map((f, i) => (
              <div key={i} style={styles.feedbackCard}>
                <b>{f.title}</b>
                <p>{f.comment}</p>
               <span style={styles.star}>{"⭐".repeat(Number(f.rating))} ({f.rating})</span>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div style={styles.pagination}>
            {Array.from({ length: totalPages || 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  ...styles.pageBtn,
                  background: currentPage === i + 1 ? "#4f8cff" : "transparent",
                  color: currentPage === i + 1 ? "white" : "#4f8cff",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= FINAL MODERN UI ================= */
const styles = {
  page: {
    fontFamily: "Arial",
    minHeight: "100vh",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 25px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
  },

  logout: {
    background: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  container: {
    display: "flex",
    gap: 20,
    padding: 20,
  },

  box: {
    flex: 1,
    background: "rgba(255,255,255,0.95)",
    padding: 15,
    borderRadius: 12,
  },

  scroll: {
    maxHeight: 220,
    overflowY: "auto",
  },

  card: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    background: "#f5f5f5",
  },

  btn: {
    padding: "6px 10px",
    background: "#4f8cff",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  selectedBox: {
    marginTop: 15,
    padding: 10,
    background: "#e8f0ff",
    borderRadius: 10,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 15,
  },

  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  submit: {
    padding: 10,
    background: "#4f8cff",
    color: "white",
    border: "none",
    borderRadius: 8,
  },

  feedbackCard: {
    padding: 12,
    marginBottom: 10,
    background: "#f5f5ff",
    borderRadius: 10,
  },

  star: {
    color: "#ff9800",
    fontWeight: "bold",
  },

  pagination: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    marginTop: 10,
  },

  pageBtn: {
    padding: "5px 10px",
    border: "1px solid #4f8cff",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default Dashboard;