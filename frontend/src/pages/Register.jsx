import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function Register() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // handle text inputs
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // handle file inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length) {
      if (name === "avatar") setAvatar(files[0]);
      else if (name === "coverImage") setCoverImage(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // avatar is required
    if (!avatar) {
      setError("Avatar is required");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", form.fullname);
    formData.append("email", form.email);
    formData.append("username", form.username);
    formData.append("password", form.password);
    formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      await api.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/login");
    } catch (err) {
      console.error("🛑 Registration error:", err.response || err);
      const msg =
        err.response?.data?.message ??
        err.message ??
        "Registration failed";
      setError(msg);
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white rounded shadow"
        style={{ width: "360px" }}
      >
        <h2 className="mb-4 text-center">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            name="fullname"
            type="text"
            className="form-control"
            value={form.fullname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            name="username"
            type="text"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Avatar (required)</label>
          <input
            name="avatar"
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cover Image (optional)</label>
          <input
            name="coverImage"
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>
    </div>
  );
}
