import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

export default function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    api.get("/users/history")
      .then(res => setHistory(res.data.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-5">Loading history…</p>;
  if (error)   return <div className="alert alert-danger">{error}</div>;
  if (!history.length) return <p className="text-center mt-5">No watched videos yet.</p>;

  return (
    <div className="container py-5">
      <h1 className="mb-4">Watch History</h1>
      <div className="row g-4">
        {history.map((v) => (
          <div key={v._id} className="col-sm-6 col-lg-4">
            <Link to={`/videos/${v._id}`} className="text-decoration-none">
              <div className="card h-100">
                <img
                  src={v.thumbnail}
                  className="card-img-top"
                  alt={v.title}
                  style={{ objectFit: "cover", height: "180px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{v.title}</h5>
                  {/* Channel link */}
                  <p className="card-text">
                    by{" "}
                    <Link to={`/channel/${v.owner.username}`}>
                      {v.owner.username}
                    </Link>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
