import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new playlist
// POST /api/v1/playlists
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Validate that required fields are provided
  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  // Create a new Playlist document associating it with the authenticated user
  const newPlaylist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newPlaylist, "Playlist created successfully"));
});

// Get all playlists for a given user
// GET /api/v1/playlists/user/:userId
const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  // Retrieve playlists where owner matches the provided userId
  const playlists = await Playlist.find({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "User playlists fetched successfully"));
});

// Get a single playlist by its id
// GET /api/v1/playlists/:playlistId
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  // Populate videos and a bit of owner details for richer response
  const playlist = await Playlist.findById(playlistId)
    .populate("videos")
    .populate("owner", "username avatar");

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

// Add a video to a playlist
// PATCH /api/v1/playlists/add/:videoId/:playlistId
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (
    !playlistId ||
    !isValidObjectId(playlistId) ||
    !videoId ||
    !isValidObjectId(videoId)
  ) {
    throw new ApiError(400, "Invalid playlist id or video id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // Ensure that the authenticated user is the playlist owner
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to modify this playlist");
  }

  // Check if the video is already in the playlist to avoid duplicates
  if (playlist.videos.includes(videoId)) {
    return res.status(200).json(new ApiResponse(200, playlist, "Video is already in the playlist"));
  }

  playlist.videos.push(videoId);
  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
});

// Remove a video from a playlist
// PATCH /api/v1/playlists/remove/:videoId/:playlistId
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (
    !playlistId ||
    !isValidObjectId(playlistId) ||
    !videoId ||
    !isValidObjectId(videoId)
  ) {
    throw new ApiError(400, "Invalid playlist id or video id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // Ensure the authenticated user is the playlist owner
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to modify this playlist");
  }

  // Find the index of the video in the playlist videos array
  const index = playlist.videos.indexOf(videoId);
  if (index === -1) {
    return res.status(404).json(new ApiResponse(404, playlist, "Video not found in the playlist"));
  }

  // Remove the video from the array and save
  playlist.videos.splice(index, 1);
  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist successfully"));
});

// Delete a playlist
// DELETE /api/v1/playlists/:playlistId
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // Ensure the authenticated user is the owner
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this playlist");
  }

  await playlist.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

// Update a playlist's name and/or description
// PATCH /api/v1/playlists/:playlistId
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // Ensure the authenticated user owns the playlist
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this playlist");
  }

  if (name) playlist.name = name.trim();
  if (description) playlist.description = description.trim();

  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
