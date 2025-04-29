import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

export default function LikedVideos() {
  const [videos, setVideos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    api
      .get("/likes/videos")
      .then(res => {
        // Ensure it's an array
        setVideos(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load liked videos");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-5">Loading liked videos…</p>;
  if (error)   return <div className="alert alert-danger">{error}</div>;
  if (!videos.length)
    return <p className="text-center mt-5">You haven’t liked any videos yet.</p>;

  return (
    <div className="container py-5">
      <h1 className="mb-4">Liked Videos</h1>
      <div className="row g-4">
        {videos.map(v =>
          v && v._id ? (
            <div key={v._id} className="col-sm-6 col-lg-4">
              <Link to={`/videos/${v._id}`} className="text-decoration-none">
                <div className="card h-100">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="card-img-top"
                    style={{ objectFit: "cover", height: "180px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{v.title}</h5>
                    {/* <p className="card-text text-muted">
                      {v.views} views
                    </p> */}
                  </div>
                </div>
              </Link>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
