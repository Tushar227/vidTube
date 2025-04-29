
// src/pages/PlaylistDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist]       = useState(null);
  const [myVideos, setMyVideos]       = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [editMode, setEditMode]       = useState(false);
  const [form, setForm]               = useState({ name: "", description: "" });
  const [message, setMessage]         = useState("");

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [plRes, vidsRes] = await Promise.all([
          api.get(`/playlists/${playlistId}`),
          api.get(`/dashboard/videos`),
        ]);
        const pl = plRes.data.data;
        setPlaylist(pl);
        setForm({ name: pl.name, description: pl.description });
        setMyVideos(vidsRes.data.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load playlist or your videos."
        );
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [playlistId]);

  const addVideo = async () => {
    if (!selectedVideo) return;
    try {
      await api.patch(`/playlists/add/${selectedVideo}/${playlistId}`);
      const res = await api.get(`/playlists/${playlistId}`);
      setPlaylist(res.data.data);
      setMessage("Video added successfully");
      setSelectedVideo("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not add video");
    }
  };

  const removeVideo = async (vid) => {
    try {
      await api.patch(`/playlists/remove/${vid}/${playlistId}`);
      setPlaylist((prev) => ({
        ...prev,
        videos: (prev.videos || []).filter((v) => v._id !== vid),
      }));
      setMessage("Video removed successfully");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not remove video");
    }
  };

  const updatePlaylist = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api.patch(`/playlists/${playlistId}`, form);
      setPlaylist(res.data.data);
      setMessage("Playlist updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not update playlist");
    }
  };

  const deletePlaylist = async () => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    try {
      await api.delete(`/playlists/${playlistId}`);
      navigate("/playlists");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not delete playlist");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading playlist…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!playlist) return <p className="text-center mt-5">Playlist not found.</p>;

  const videosArray = playlist.videos || [];

  return (
    <div className="container py-5">
      {message && <div className="alert alert-success">{message}</div>}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>{playlist.name}</h1>
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setEditMode((e) => !e)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={deletePlaylist}
          >
            Delete Playlist
          </button>
        </div>
      </div>

      {editMode && (
        <form onSubmit={updatePlaylist} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              required
            />
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </form>
      )}

      <p className="text-muted mb-4">{playlist.description}</p>

      {/* Add-video selector */}
      <div className="mb-4">
        <label className="form-label">Add a video:</label>
        <div className="input-group">
          <select
            className="form-select"
            value={selectedVideo}
            onChange={(e) => setSelectedVideo(e.target.value)}
          >
            <option value="">-- Select a video --</option>
            {myVideos.map((v) => (
              <option key={v._id} value={v._id}>
                {v.title}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={addVideo}
            disabled={!selectedVideo}
          >
            Add
          </button>
        </div>
      </div>

      <h4 className="mt-5">Videos in this playlist</h4>
      {videosArray.length === 0 ? (
        <p className="text-muted">No videos added yet.</p>
      ) : (
        <ul className="list-group">
          {videosArray.map((v) => (
            <li
              key={v._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <Link to={`/videos/${v._id}`}>{v.title}</Link>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeVideo(v._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
