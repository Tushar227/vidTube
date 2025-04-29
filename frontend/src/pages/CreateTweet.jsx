// src/pages/CreateTweet.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function CreateTweet() {
  const [content, setContent] = useState("");
  const [error, setError]     = useState("");
  const navigate              = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }
    try {
      await api.post("/tweets", { content: content.trim() });
      navigate("/tweets");
    } catch (e) {
      console.error(e);
      setError("Failed to post tweet");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">New Tweet</h1>
      <form onSubmit={onSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <textarea
            className="form-control"
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Tweet
        </button>
      </form>
    </div>
  );
}
