import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";

export default function ChannelProfile() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    api.get(`/users/channel/${username}`)
      .then(res => setChannel(res.data.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [username]);

  const toggle = async () => {
    try {
      await api.post(`/subscriptions/c/${channel._id}`);
      // flip subscribe state and adjust count localy
      setChannel(c => ({
        ...c,
        isSubscribed: !c.isSubscribed,
        subscribersCount: c.isSubscribed
          ? c.subscribersCount - 1
          : c.subscribersCount + 1,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading channel…</p>;
  if (error)   return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        {channel.coverImage && (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="img-fluid rounded mb-3"
            style={{ maxHeight: "200px", objectFit: "cover", width: "100%" }}
          />
        )}
        {channel.avatar && (
          <img
            src={channel.avatar}
            alt="Avatar"
            className="rounded-circle border border-white mb-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        )}
        <h2>{channel.fullname} (@{channel.username})</h2>
        <p>
          {channel.subscribersCount} subscribers •{" "}
          {channel.channelsSubscribedToCount} subscriptions
        </p>
        <button
          onClick={toggle}
          className={`btn ${channel.isSubscribed ? "btn-secondary" : "btn-danger"}`}
        >
          {channel.isSubscribed ? "Unsubscribe" : "Subscribe"}
        </button>
      </div>

      {/* …your channel’s videos here… */}
    </div>
  );
}
