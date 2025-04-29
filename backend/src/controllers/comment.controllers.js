import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/v1/comments/:videoId
// Get all comments for a given video with pagination.
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Validate videoId
  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid or missing video ID");
  }

  // Use the new keyword to convert videoId to ObjectId
  const filter = { video: new mongoose.Types.ObjectId(videoId) };

  // Retrieve comments with pagination and populate owner details
  const comments = await Comment.find(filter)
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Comment.countDocuments(filter);
  const result = {
    docs: comments,
    totalDocs: total,
    limit: parseInt(limit),
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Comments fetched successfully"));
});

// POST /api/v1/comments/:videoId
// Add a comment to a specific video.
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid or missing video ID");
  }
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content is required");
  }

  // Create new comment using "new" keyword for ObjectId conversion
  const newComment = await Comment.create({
    content: content.trim(),
    video: new mongoose.Types.ObjectId(videoId),
    owner: new mongoose.Types.ObjectId(req.user._id)
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added successfully"));
});

// PATCH /api/v1/comments/c/:commentId
// Update an existing comment.
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid or missing comment ID");
  }
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Updated comment content is required");
  }

  // Retrieve comment from the database
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  // Ensure the current user is the owner of the comment
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this comment");
  }

  // Update and save the comment
  comment.content = content.trim();
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

// DELETE /api/v1/comments/c/:commentId
// Delete a comment.
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid or missing comment ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  // Check if the current user is the owner
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this comment");
  }

  await comment.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
