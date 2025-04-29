// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const AVATAR = 120, BANNER = 200;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = await api.get("/users/current-user");
        setUser(u.data.data);

        const s = await api.get("/dashboard/stats");
        setStats(s.data.data);

        const sub = await api.get(`/subscriptions/u/${u.data.data._id}`);
        setSubscriptions(sub.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status" />
        <span className="visually-hidden">Loading…</span>
      </div>
    );

  if (error)
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div className="container py-5">
      <div style={{ position: "relative", marginBottom: AVATAR / 2 }}>
        <div
          className="img-fluid rounded-top w-100"
          style={{
            height: BANNER,
            backgroundColor: "#e9ecef",
            backgroundImage: user.coverImage ? `url(${user.coverImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {user.avatar && (
          <img
            src={user.avatar}
            alt="Avatar"
            className="rounded-circle border border-white"
            style={{
              width: AVATAR,
              height: AVATAR,
              objectFit: "cover",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: -(AVATAR / 2),
              background: "white",
            }}
          />
        )}
      </div>

      <div className="text-center mb-5">
        <h2>{user.fullname}</h2>
      </div>

      <h1 className="mb-4">Channel Dashboard</h1>
      <div className="row g-4 mb-5">
        {[
          { label: "Total Videos", value: stats.totalVideos, color: "primary" },
          { label: "Subscribers", value: stats.totalSubscribers, color: "warning" },
          { label: "Total Likes", value: stats.totalLikes, color: "danger" },
          { label: "Subscribed Channels", value: subscriptions.length, color: "info" },
        ].map(({ label, value, color }) => (
          <div key={label} className="col-sm-6 col-lg-3">
            <div className={`card text-white bg-${color} h-100`}>
              <div className="card-body text-center">
                <h5 className="card-title">{label}</h5>
                <p className="display-6">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
