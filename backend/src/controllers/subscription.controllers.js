import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Toggle subscription.
 * The authenticated user (req.user._id) toggles subscribing to the channel specified by channelId.
 * POST /api/v1/subscriptions/c/:channelId
 */
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscriberId = req.user._id;

  // Check if a subscription already exists where the subscriber is the current user and channel is channelId.
  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  let message = "";
  if (existingSubscription) {
    // If exists, remove (unsubscribe)
    await existingSubscription.deleteOne();
    message = "Unsubscribed successfully";
  } else {
    // Else, create a new subscription (subscribe)
    await Subscription.create({
      subscriber: subscriberId,
      channel: channelId,
    });
    message = "Subscribed successfully";
  }

  return res.status(200).json(new ApiResponse(200, null, message));
});

/**
 * Get subscribers for a channel.
 * Returns the list of users who have subscribed to the channel.
 * GET /api/v1/subscriptions/c/:channelId
 */
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Find all subscriptions for this channel and populate the subscriber details
  const subscriptions = await Subscription.find({
    channel: channelId,
  }).populate("subscriber", "username email avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Channel subscribers fetched successfully"));
});

/**
 * Get subscribed channels for a user.
 * Returns the list of channels the user has subscribed to.
 * GET /api/v1/subscriptions/u/:subscriberId
 */
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  // Find all subscriptions where the subscriber matches the provided subscriberId
  const subscriptions = await Subscription.find({
    subscriber: subscriberId,
  }).populate("channel", "username email avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
};
