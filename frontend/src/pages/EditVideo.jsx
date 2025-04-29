// src/pages/EditVideo.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function EditVideo() {
  const { videoId } = useParams();
  const navigate    = useNavigate();

  const [form, setForm]             = useState({ title: "", description: "" });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    api.get(`/videos/${videoId}`)
      .then(res => {
        setForm({
          title: res.data.data.title,
          description: res.data.data.description,
        });
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [videoId]);

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (thumbnailFile) fd.append("thumbnail", thumbnailFile);

    try {
      await api.patch(`/videos/${videoId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/videos/${videoId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading…</p>;

  return (
    <div className="container py-5">
      <h1>Edit Video</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Thumbnail (optional)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={e => setThumbnailFile(e.target.files[0])}
          />
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
