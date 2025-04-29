import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

export default function Videos() {
  const [videos, setVideos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    api.get("/videos")
      .then(res => {
        // Filter only published videos
        const publishedVideos = res.data.data.docs.filter(v => v.isPublished);
        setVideos(publishedVideos);
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-5">Loading videos…</p>;
  if (error)   return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>All Videos</h1>
        <Link to="/upload" className="btn btn-primary">Upload Video</Link>
      </div>
      <div className="row g-4">
        {videos.map(v => (
          <div key={v._id} className="col-sm-6 col-lg-4">
            <div className="card h-100">
              <Link to={`/videos/${v._id}`} className="text-decoration-none">
                <img
                  src={v.thumbnail}
                  className="card-img-top"
                  alt={v.title}
                  style={{ objectFit: "cover", height: 180 }}
                />
                <div className="card-body">
                  <h5 className="card-title">{v.title}</h5>
                  <p className="card-text text-muted">
                    by <Link to={`/channel/${v.owner.username}`}>{v.owner.username}</Link>
                  </p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
