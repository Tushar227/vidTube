import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function CreatePlaylist() {
  const [name, setName]         = useState("");
  const [description, setDescription] = useState("");
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/playlists", { name, description });
      navigate(`/playlists/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">New Playlist</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <button className="btn btn-success">Create</button>
      </form>
    </div>
  );
}
