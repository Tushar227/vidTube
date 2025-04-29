// src/pages/Subscriptions.jsx

import React, { useEffect, useState } from "react";
import api from "../utils/axios";

export default function Subscriptions() {
  const [channels, setChannels]       = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        // 1) get current user
        const uRes = await api.get("/users/current-user");
        const userId = uRes.data.data._id;

        // 2) channels I have subscribed to:
        const cRes = await api.get(`/subscriptions/u/${userId}`);
        // cRes.data.data is an array of Subscription docs, with .channel populated
        const myChannels = cRes.data.data.map((s) => s.channel || {});
        
        // 3) users who subscribed to my channel:
        const sRes = await api.get(`/subscriptions/c/${userId}`);
        const mySubscribers = sRes.data.data.map((s) => s.subscriber || {});

        if (!mounted) return;
        setChannels(myChannels);
        setSubscribers(mySubscribers);
      } catch (e) {
        console.error("Failed to load subscriptions:", e);
        if (mounted) setError(e.response?.data?.message || e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"/>
        <span className="visually-hidden">Loading…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Subscribed Channels</h2>
      {channels.length === 0 ? (
        <p className="text-muted">You haven’t subscribed to any channels yet.</p>
      ) : (
        <ul className="list-group mb-4">
          {channels.map((ch) => (
            <li key={ch._id} className="list-group-item">
              {ch.username} ({ch.email})
            </li>
          ))}
        </ul>
      )}

      <h2>Your Subscribers</h2>
      {subscribers.length === 0 ? (
        <p className="text-muted">No one has subscribed to your channel yet.</p>
      ) : (
        <ul className="list-group">
          {subscribers.map((sub) => (
            <li key={sub._id} className="list-group-item">
              {sub.username} ({sub.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
