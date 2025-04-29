// src/pages/VideoDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";

export default function VideoDetail() {
  const { videoId } = useParams();
  const navigate    = useNavigate();

  // Video, comments, user, like state
  const [video, setVideo]       = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser]         = useState(null);
  const [isLiked, setIsLiked]   = useState(false);

  // Track which comments are liked locally
  const [commentLiked, setCommentLiked] = useState({});

  // Loading & errors
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // Comment form & edit state
  const [newComment, setNewComment]         = useState("");
  const [editingId, setEditingId]           = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // 1️⃣ Load video, comments, user, and initialize commentLiked
  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, cRes, uRes, likedRes] = await Promise.all([
          api.get(`/videos/${videoId}`),
          api.get(`/comments/${videoId}`),
          api.get("/users/current-user"),
          api.get("/likes/videos"),
        ]);
  
        const videoData = vRes.data.data;
        const userData = uRes.data.data;
        const likedList = likedRes.data.data || [];
  
        setVideo(videoData);
        setUser(userData);
        setComments(cRes.data.data.docs || []);
  
        // Safely check if current video is liked
        if (videoData && videoData._id && userData && userData._id) {
          setIsLiked(likedList.some(v => v && v._id === videoData._id));
        } else {
          setIsLiked(false);
        }
  
      } catch (err) {
        console.error(err);
        setError("Failed to load video or comments.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [videoId]);
  if (loading) return <p className="text-center mt-5">Loading…</p>;
  if (error)   return <div className="alert alert-danger">{error}</div>;
  if (!video)  return <p className="text-center mt-5">Video not found.</p>;

  const isVideoOwner = user?._id === video.owner._id.toString();

  // ▶️ Toggle video like/unlike
  const toggleVideoLike = async () => {
    try {
      await api.post(`/likes/toggle/v/${videoId}`);
      setIsLiked((prev) => !prev);
    } catch (e) {
      console.error("Failed to toggle video like:", e);
    }
  };

  // ▶️ Toggle comment like/unlike (local UI only)
  const toggleCommentLike = async (commentId) => {
    try {
      await api.post(`/likes/toggle/c/${commentId}`);
      setCommentLiked((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
    } catch (e) {
      console.error("Failed to toggle comment like:", e);
    }
  };

  // 📝 Post new comment
  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/comments/${videoId}`, {
        content: newComment.trim(),
      });
      setComments([{ ...res.data.data, owner: user }, ...comments]);
      setNewComment("");
    } catch {
      setError("Failed to add comment.");
    }
  };

  // 📝 Save edited comment
  const saveEdit = async () => {
    if (!editingContent.trim()) return;
    try {
      const res = await api.patch(`/comments/c/${editingId}`, {
        content: editingContent.trim(),
      });
      setComments(
        comments.map((c) =>
          c._id === editingId ? res.data.data : c
        )
      );
      setEditingId(null);
      setEditingContent("");
    } catch {
      setError("Failed to update comment.");
    }
  };

  // 🗑️ Delete a comment (only by owner)
  const onDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/c/${id}`);
      setComments(comments.filter((c) => c._id !== id));
    } catch {
      setError("Failed to delete comment.");
    }
  };

  return (
    <div className="container py-5">
      {/* Video Player */}
      <h1 className="mb-4">{video.title}</h1>
      <video
        src={video.videoFile}
        controls
        autoPlay
        className="w-100 mb-4"
        style={{ maxHeight: "480px" }}
      />

      {/* Metadata & Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          {video.owner.avatar && (
            <img
              src={video.owner.avatar}
              alt={video.owner.username}
              className="rounded-circle me-2"
              width={40}
              height={40}
              style={{ objectFit: "cover" }}
            />
          )}
          <Link
            to={`/channel/${video.owner.username}`}
            className="fw-bold"
          >
            {video.owner.username}
          </Link>
        </div>
        <div>
          <button
            className={`btn me-2 ${
              isLiked ? "btn-danger" : "btn-outline-primary"
            }`}
            onClick={toggleVideoLike}
          >
            {isLiked ? "Unlike" : "Like"}
          </button>

          {isVideoOwner && (
            <>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => navigate(`/videos/${videoId}/edit`)}
              >
                Edit Video
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={async () => {
                  if (!window.confirm("Delete this video?")) return;
                  await api.delete(`/videos/${videoId}`);
                  navigate("/my-videos");
                }}
              >
                Delete Video
              </button>
            </>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mb-5">
        <h4>Comments</h4>

        {/* Add new comment */}
        <div className="mb-3">
          <textarea
            className="form-control"
            rows={2}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="btn btn-primary mt-2"
            onClick={postComment}
          >
            Post Comment
          </button>
        </div>

        {/* List existing comments */}
        {comments.map((c) => {
          const isOwner = user._id === c.owner._id.toString();
          const liked   = !!commentLiked[c._id];

          return (
            <div key={c._id} className="mb-3 p-3 border rounded">
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  {c.owner.avatar && (
                    <img
                      src={c.owner.avatar}
                      alt={c.owner.username}
                      className="rounded-circle me-2"
                      width={30}
                      height={30}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <strong>{c.owner.username}</strong>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-link me-2"
                    onClick={() => toggleCommentLike(c._id)}
                  >
                    {liked ? "Unlike" : "Like"}
                  </button>
                  {isOwner && editingId !== c._id && (
                    <button
                      className="btn btn-sm btn-link me-2"
                      onClick={() => {
                        setEditingId(c._id);
                        setEditingContent(c.content);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {isOwner && (
                    <button
                      className="btn btn-sm btn-link text-danger"
                      onClick={() => onDelete(c._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {editingId === c._id ? (
                <>
                  <textarea
                    className="form-control mb-2"
                    rows={2}
                    value={editingContent}
                    onChange={(e) =>
                      setEditingContent(e.target.value)
                    }
                  />
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={saveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <p className="mb-0 mt-2">{c.content}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
