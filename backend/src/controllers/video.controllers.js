import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";


// GET /api/v1/videos
/**
 * Retrieves a paginated list of videos with optional filtering and sorting.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A JSON response containing the paginated list of videos.
 * @throws {ApiError} If an error occurs during the database query.
 */
const getAllVideos = asyncHandler(async (req, res) => {

  if (!req.user) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // Build filter
  const filter = {};
  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }
  if (userId) {
    filter.owner = userId;
  }

  // Set up sorting options; default sort: newest first
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
  } else {
    sortOptions.createdAt = -1;
  }

  const videos = await Video.find(filter)
    .populate("owner", "username avatar")
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Video.countDocuments(filter);
  const result = {
    docs: videos,
    totalDocs: total,
    limit: parseInt(limit),
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Videos fetched successfully"));
});

// POST /api/v1/videos
// Publish a new video. Upload the video (as a "video" resource) and thumbnail to Cloudinary,
// then create the video document. If thumbnail upload fails, delete the video from Cloudinary.
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;
    
    if (!title || title.trim() === "") {
      throw new ApiError(400, "Title is required");
    }
    if (!description || description.trim() === "") {
      throw new ApiError(400, "Description is required");
    }
    if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
      throw new ApiError(400, "Both video file and thumbnail are required");
    }
  
    const videoLocalPath = req.files.videoFile[0].path;
    const thumbnailLocalPath = req.files.thumbnail[0].path;
  
    let videoUpload;
    try {
      videoUpload = await uploadOnCloudinary(videoLocalPath, { resource_type: "video" });
      if (!videoUpload || !videoUpload.url) {
        throw new Error("Video upload failed");
      }
    } catch (error) {
      throw new ApiError(500, "Failed to upload video to Cloudinary");
    }
    
    let thumbnailUpload;
    try {
      thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);
      if (!thumbnailUpload || !thumbnailUpload.url) {
        if (videoUpload.public_id) {
          await deleteFromCloudinary(videoUpload.public_id);
        }
        throw new Error("Thumbnail upload failed");
      }
    } catch (error) {
      throw new ApiError(500, "Failed to upload thumbnail to Cloudinary");
    }
    
    // Explicitly convert duration and set default if invalid
    let parsedDuration = Number(duration);
    if (isNaN(parsedDuration)) {
      parsedDuration = 0;
    }
    
    const newVideo = await Video.create({
      videoFile: videoUpload.url,
      thumbnail: thumbnailUpload.url,
      title: title.trim(),
      description: description.trim(),
      duration: parsedDuration,
      owner: req.user._id,
      isPublished: true,
      videoPublicId: videoUpload.public_id,
      thumbnailPublicId: thumbnailUpload.public_id,
    });
    
    return res
      .status(201)
      .json(new ApiResponse(201, newVideo, "Video published successfully"));
  });
  
// GET /api/v1/videos/:videoId
// Retrieve a specific video by its ID.
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId).populate("owner", "username avatar");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

// PATCH /api/v1/videos/:videoId
// Update video details such as title, description, and optionally the thumbnail.
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this video");
  }

  const { title, description } = req.body;
  if (title) video.title = title.trim();
  if (description) video.description = description.trim();

  // If a new thumbnail file is provided, update it.
  if (req.file) {
    try {
      const newThumbnail = await uploadOnCloudinary(req.file.path);
      if (newThumbnail && newThumbnail.url) {
        // Optionally delete the old thumbnail from Cloudinary.
        if (video.thumbnailPublicId) {
          await deleteFromCloudinary(video.thumbnailPublicId);
        }
        video.thumbnail = newThumbnail.url;
        video.thumbnailPublicId = newThumbnail.public_id;
      } else {
        throw new Error("Thumbnail update failed");
      }
    } catch (e) {
      throw new ApiError(500, "Failed to update thumbnail");
    }
  }

  await video.save();
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

// DELETE /api/v1/videos/:videoId
// Delete a video. Optionally delete the video and thumbnail from Cloudinary.
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this video");
  }

  // Optionally delete video and thumbnail media from Cloudinary.
  try {
    if (video.videoPublicId) {
      await deleteFromCloudinary(video.videoPublicId);
    }
    if (video.thumbnailPublicId) {
      await deleteFromCloudinary(video.thumbnailPublicId);
    }
  } catch (err) {
    console.log("Error deleting media from Cloudinary:", err);
    // Continue with deletion from the DB even if media deletion fails.
  }

  await video.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

// PATCH /api/v1/videos/toggle/publish/:videoId
// Toggle the video's publish status.
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to change publish status for this video");
  }
  video.isPublished = !video.isPublished;
  await video.save();
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video publish status toggled successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
