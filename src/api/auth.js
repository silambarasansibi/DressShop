import api from "./axios";

// ================= LOGIN =================
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  const token =
    res?.data?.accessToken ||
    res?.data?.token ||
    res?.data?.data?.accessToken ||
    res?.data?.data?.token;

  const user =
    res?.data?.user ||
    res?.data?.data?.user;

  if (token) {
    localStorage.setItem("accessToken", token);
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return res.data;
};

// ================= REGISTER =================
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

// ================= PRODUCTS (FIXED) =================
export const getProducts = async () => {
  const res = await api.post("/products/product-filter", {});

  const data =
    res?.data?.data ||
    res?.data?.products ||
    res?.data ||
    [];

  return Array.isArray(data) ? data : [];
};

// ================= FEEDBACK (FIXED PROPERLY) =================
export const getFeedback = async (page = 1, limit = 10) => {
  const res = await api.get(`/feedback?page=${page}&limit=${limit}`);

  console.log("FEEDBACK RAW RESPONSE:", res.data);

  // 🔥 YOUR REAL STRUCTURE:
  const data =
    res?.data?.data?.data ||   // MOST COMMON (your backend)
    res?.data?.data ||
    res?.data?.feedbacks ||
    res?.data ||
    [];

  return Array.isArray(data) ? data : [];
};

// ================= POST FEEDBACK =================
export const postFeedback = (data) => {
  return api.post("/feedback", {
    productId: data.productId,
    rating: Number(data.rating),
    title: data.title,
    comment: data.comment,
    images: data.images || [],
  });
};