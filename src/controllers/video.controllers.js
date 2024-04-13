import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { json } from "stream/consumers"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    try {
        let filter={};

        // Applying filtering based on query if provided

        if (query) {
            filter = { $text: {$search:query}}

        }

        //Applying sorting based on sortby and sortType if provided

        let sortCriteria = {};
        if (sortBy && sortType) {
            sortCriteria[sortBy]= sortType== 'asc' ? 1 : -1
        }

        //apply pagination
        const options ={
            limit: parseInt(limit),
            skip:(parseInt (page) - 1) * parseInt(limit),
            sort: sortCriteria

        };

        // Fetch videos from database
        let videos = await Video.find(filter, null, options);

        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    data:videos,
                    count:videos.length
                },
                "video is looking great"
            )
        )


    } catch (error) {
        res
        .status(500)
        .json(
            new ApiError(
                500,
                "Server Error"
            )
        )
        
    }
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video
    try {
        // Check if a file is included in the request
        if (!req.file) {
            return res.status(500).json(new ApiError(500, 'Please upload a video file'));
        }

        // Upload the video file to Cloudinary
        const uploadedVideo = await cloudinary.uploader.upload(req.file.path, { resource_type: 'video' });

        // Create a new video document in the database
        const newVideo = new Video({
            title,
            description,
            videoUrl: uploadedVideo.secure_url, // URL of the uploaded video on Cloudinary
            cloudinaryPublicId: uploadedVideo.public_id // Public ID of the uploaded video on Cloudinary
        });

        // Save the new video document to the database
        const savedVideo = await newVideo.save();

        // Send a success response to the client
        res.status(200).json(new ApiResponse(200, { data: savedVideo }, "Video is looking great"));
    } catch (error) {
        res.status(500).json(new ApiError(500, "Server Error"));
    }
});


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    try {
        // check if provided VideoId is a valid ObjectId
        if (!isValidObjectId(videoId)) {
            return res
            .status(400)
            .json(new ApiError(400,"Invalid video ID"))  
        };

        // Find the video by its ID in database

        const video = await Video.findById(videoId);

        // check if the video exists
        if (!video) {
            return res
            .status(400)
            .json(new ApiError(400,"Video not found"))};

        res
        .status(200)
        .json(new ApiResponse(200, {data:video},"Video Found"));

    } catch (error) {
        // Handle server error
        res.status(500).json(new ApiError(500, "Server Error"));
    }

});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details title, description, thumbnail
    const { title, description, thumbnail } = req.body;

    try {
        if (!isValidObjectId(videoId)) {
            return res.status(400).json(new ApiError(400, "Invalid video ID"));
        }

        let video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json(new ApiError(404, "Video not found"));
        }

        // Update the video details
        if (title !== undefined) {
            video.title = title;
        }

        if (description !== undefined) {
            video.description = description;
        }

        if (thumbnail !== undefined) {
            video.thumbnail = thumbnail;
        }

        // Save the updated video details to the database
        video = await video.save();

        // Send the updated video data in the response
        res.status(200).json(new ApiResponse(200, { data: video }, "Video details updated successfully"));
    } catch (error) {
        res.status(500).json(new ApiError(500, "Server Error"));
    }
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    try {
        // Check if the provided videoId is a valid ObjectId
        if (!isValidObjectId(videoId)) {
            return res.status(400).json(new ApiError(400, 'Invalid video ID'));
        }

        // Find the video by its ID in the database
        const video = await Video.findById(videoId);

        // Check if the video exists
        if (!video) {
            return res.status(404).json(new ApiError(404, 'Video not found'));
        }

        // Delete the video from the database
        await Video.deleteOne({ _id: videoId });

        // Send a success response
        res.status(200).json(new ApiResponse(200, null, 'Video deleted successfully'));
    } catch (error) {
        // Handle server errors
        res.status(500).json(new ApiError(500, 'Server Error'));
    }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    try {
        // Check if the provided videoId is a valid ObjectId
        if (!isValidObjectId(videoId)) {
            return res.status(400).json(new ApiError(400, 'Invalid video ID'));
        }

        // Find the video by its ID in the database
        const video = await Video.findById(videoId);

        // Check if the video exists
        if (!video) {
            return res.status(404).json(new ApiError(404, 'Video not found'));
        }

        // Toggle the publish status
        video.published = !video.published;

        // Save the updated video with the toggled publish status
        await video.save();

        // Send a success response with the updated video data
        res.status(200).json(new ApiResponse(200, { data: video }, 'Publish status toggled successfully'));
    } catch (error) {
        // Handle server errors
        res.status(500).json(new ApiError(500, 'Server Error'));
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
