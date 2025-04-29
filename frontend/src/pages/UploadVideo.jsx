import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function UploadVideo() {
  const [form, setForm]           = useState({ title: "", description: "", duration: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError]         = useState("");
  const navigate                  = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFile = e => {
    const { name, files } = e.target;
    if (files.length) name === "videoFile" ? setVideoFile(files[0]) : setThumbnail(files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!videoFile || !thumbnail) return setError("Both files required");
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => fd.append(k, v));
    fd.append("videoFile", videoFile);
    fd.append("thumbnail", thumbnail);

    try {
      await api.post("/videos", fd, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/videos");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Upload Video</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={form.description} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Duration (seconds)</label>
          <input name="duration" type="number" className="form-control" value={form.duration} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Video File</label>
          <input name="videoFile" type="file" accept="video/*" className="form-control" onChange={handleFile} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Thumbnail</label>
          <input name="thumbnail" type="file" accept="image/*" className="form-control" onChange={handleFile} required />
        </div>
        <button className="btn btn-success">Publish</button>
      </form>
    </div>
  );
}
