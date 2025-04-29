// src/pages/Playlists.jsx

import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

export default function Playlists() {
  const [pls, setPls]         = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const loadPlaylists = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // 1) get current user id
      const userRes = await api.get("/users/current-user");
      const userId  = userRes.data.data._id;
      // 2) get their playlists
      const res = await api.get(`/playlists/user/${userId}`);
      setPls(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load playlists");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaylists();
    window.addEventListener("focus", loadPlaylists);
    return () => window.removeEventListener("focus", loadPlaylists);
  }, [loadPlaylists]);

  // Always render the header & New Playlist button
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Playlists</h1>
        <Link to="/playlists/new" className="btn btn-primary">
          New Playlist
        </Link>
      </div>

      {loading ? (
        <p className="text-center mt-5">Loading playlists…</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : pls.length === 0 ? (
        <p className="text-center mt-5">You have no playlists yet.</p>
      ) : (
        <div className="row g-4">
          {pls.map((pl) => (
            <div key={pl._id} className="col-sm-6 col-lg-4">
              <Link to={`/playlists/${pl._id}`} className="text-decoration-none">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{pl.name}</h5>
                    <p className="card-text">
                      {Array.isArray(pl.videos) ? pl.videos.length : 0}{" "}
                      {pl.videos.length === 1 ? "video" : "videos"}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
