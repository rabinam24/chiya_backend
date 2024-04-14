import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    const userId = req.user?._id

    if (!( name || description)) {
        return res.status(400).json(new ApiError(400, "Please provide name and description"));
    }

    try {
        const newPlaylist = await new Playlist({
            name,
            description,
            owner: userId
        });
    
        const savedPlaylist = await newPlaylist.save();
        res.status(201).json(new ApiResponse(201, {data: savedPlaylist}, "Playlist created successfully"));
    } catch (error) {
        res.status(500).json(new ApiError(500, "Failed to create the playlist"));
    }

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    //validate the userId

    if(!isValidObjectId(userId)){
        return res.status(400).json(new ApiError(400, "Invalid userId"));
    }
    try {
        // Find playlists belonging to the specified user
        const playlists = await Playlist.find({ owner: userId });

        // Check if playlists are found
        if (!playlists || playlists.length === 0) {
            return res.status(404).json(new ApiError(404, "User playlists not found"));
        }

        // Respond with the fetched playlists
        res.status(200).json(new ApiResponse(200, { playlists }, "User playlists fetched successfully"));
    } catch (error) {
        // Handle any errors that occur during playlist retrieval
        console.error("Error fetching user playlists:", error);
        res.status(500).json(new ApiError(500, "Failed to fetch user playlists"));
    }
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
