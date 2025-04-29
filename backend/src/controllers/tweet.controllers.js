import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new tweet
// POST /api/v1/tweets
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required for a tweet");
  }

  // Create a tweet with the current user's id as the owner.
  const tweet = await Tweet.create({
    content: content.trim(),
    owner: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(201, tweet, "Tweet created successfully")
  );
});

// Get all tweets of a specific user
// GET /api/v1/tweets/user/:userId
const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // Find tweets for the specified user, sorted by creation date (newest first)
  const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, tweets, "User tweets fetched successfully")
  );
});

// Update an existing tweet
// PATCH /api/v1/tweets/:tweetId
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required to update the tweet");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  // Ensure that only the owner of the tweet can update it.
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this tweet");
  }

  tweet.content = content.trim();
  await tweet.save();

  return res.status(200).json(
    new ApiResponse(200, tweet, "Tweet updated successfully")
  );
});

// Delete a tweet
// DELETE /api/v1/tweets/:tweetId
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  // Ensure that only the owner can delete the tweet.
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this tweet");
  }

  await tweet.deleteOne();
  return res.status(200).json(
    new ApiResponse(200, null, "Tweet deleted successfully")
  );
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
