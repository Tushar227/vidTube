import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle like on a video
// POST /api/v1/likes/toggle/v/:videoId
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  // Check if a like exists for this video by the current user
  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  let message = "";
  if (existingLike) {
    // If exists, remove it (unlike)
    await existingLike.deleteOne();
    message = "Video unliked successfully";
  } else {
    // Else, create a like for the video
    await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    message = "Video liked successfully";
  }

  return res.status(200).json(new ApiResponse(200, null, message));
});

// Toggle like on a comment
// POST /api/v1/likes/toggle/c/:commentId
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  let message = "";
  if (existingLike) {
    await existingLike.deleteOne();
    message = "Comment unliked successfully";
  } else {
    await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    message = "Comment liked successfully";
  }

  return res.status(200).json(new ApiResponse(200, null, message));
});

// Toggle like on a tweet
// POST /api/v1/likes/toggle/t/:tweetId
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  let message = "";
  if (existingLike) {
    await existingLike.deleteOne();
    message = "Tweet unliked successfully";
  } else {
    await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
    });
    message = "Tweet liked successfully";
  }

  return res.status(200).json(new ApiResponse(200, null, message));
});

// Get all videos liked by the current user
// GET /api/v1/likes/videos
const getLikedVideos = asyncHandler(async (req, res) => {
  // Find likes made by the user that have a 'video' value (i.e. not null)
  const likedVideos = await Like.find({
    video: { $ne: null },
    likedBy: req.user._id,
  }).populate("video"); // populate the video field to get full video details

  // Map to extract the videos from the like documents
  const videos = likedVideos.map(like => like.video);

  return res.status(200).json(
    new ApiResponse(200, videos, "Liked videos fetched successfully")
  );
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos
};
