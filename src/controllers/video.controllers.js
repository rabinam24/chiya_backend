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
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
