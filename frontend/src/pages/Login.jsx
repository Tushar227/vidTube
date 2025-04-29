import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");              // clear old errors
    try {
      await api.post("/users/login", { email, password });
      navigate("/dashboard");
    } catch (err) {
      // 1️⃣ Dump the entire error to the console:
      console.error("🔴 Login error full:", err);

      // 2️⃣ Pull the server‑side message if present
      const serverMsg =
        err.response?.data?.message   // ApiError message
        || err.response?.data         // fallback if data is a string
        || err.message                // generic axios error
        || "Login failed";

      setError(serverMsg);
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow" style={{ width: "320px" }}>
        <h2 className="mb-4 text-center">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}
