import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/v1/dashboard/stats
// Get channel statistics: total video views, total subscribers, total videos, total likes
const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Count the total number of videos uploaded by the channel
  const totalVideos = await Video.countDocuments({ owner: userId });

  // Sum the views from all videos owned by the channel using aggregation
  const videoViewsAgg = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } }
  ]);
  const totalViews = videoViewsAgg.length ? videoViewsAgg[0].totalViews : 0;

  // Count total subscribers for the channel (i.e., count subscriptions where channel equals userId)
  const totalSubscribers = await Subscription.countDocuments({ channel: userId });

  // For total likes, first gather all video IDs uploaded by the channel
  const videoIds = await Video.find({ owner: userId }).distinct("_id");
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

  const stats = {
    totalVideos,
    totalViews,
    totalSubscribers,
    totalLikes,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

// GET /api/v1/dashboard/videos
// Get all videos uploaded by the channel (i.e. the logged-in user)
const getChannelVideos = asyncHandler(async (req, res) => {
  const channelId = req.user._id;
  const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export {
  getChannelStats, 
  getChannelVideos
};
