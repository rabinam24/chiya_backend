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
    if(!isValidObjectId(playlistId)){
        return res.status(400).json(new ApiError(400, "Invalid playlistId"));
    }
    try {
        const playlist = await Playlist.findById(playlistId);
        if(!playlist){
            return res.status(404).json(new ApiError(404, "Playlist not found"));
        }
        res.status(200).json(new ApiResponse(200, {data:playlist}, "Playlist found successfully"));

    } catch (error) {
        res.status(500).json(new ApiError(500, "Failed to fetch playlist by Id"));
        
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: add video to playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        return res.status(400).json(new ApiError(400, "Invalid playlistId or videoId"));
    }

    // finding the playlist by its ID

    try {
        const playlist =  await Playlist.findById(playlistId);
    
        if(!playlist){
            return res.status(404).json(new ApiError(404, "Playlist not found"));
        }
    
        // check if the videoId is already exist in the playlist
    
        if(playlist.videos.includes(videoId)){
            return res.status(400, new ApiError(400,"Video already exist in the playlist"));
        }
    
        // add the video to the playlist
        playlist.videos.push(videoId);
        await playlist.save();
    
        // response the success message
    
        res.status(200).json(new ApiResponse(200, {data:playlist}, "Video added to playlist successfully"));
    } catch (error) {

        res.status(500).json(new ApiError(500, "Failed to add video to playlist"));
    }

    })


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        return res.status(400).json(new ApiError(400, "Invalid playlistId or videoId"));
    }

    // finding the playlist by its ID
    try {
        const playlist = await Playlist.findById(playlistId)
    
        if (!playlist) {
            return res.status(404).json(new ApiError(404, "Playlist not found"));
        }
    
        // check if the videoId is present in the playlist or not
    
        const isVideoExist = playlist.videos.includes(videoId);
    
        if(!isVideoExist){
            return res.status(404).json(new ApiError(404, "Video not found in the playlist"));
        }
    
        //remove the video from the playlist 
    
        playlist.videos = playlist.videos.filter((video) => video !== videoId);
    
        await playlist.save()
    
        res.status(200).json(new ApiResponse(200, {data:playlist}, "Video removed from playlist successfully"))
    } catch (error) {
        res.status(500).json(new ApiError(500, "Failed to remove video from playlist"));
    }

});

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(isValidObjectId(playlistId)){
        return res.status(400).json(new ApiError(400, "Invalid playlistId"));
    }
    try {
        const playlist = await Playlist.findByIdAndDelete(playlistId)

        if(!playlist){
            return res.status(404).json(new ApiError(404, "Playlist not found"));
        }
        res.status(200).json(new ApiResponse(200, {data:playlist}, "Playlist deleted successfully"))


    } catch (error) {
        res.status(500).json(new ApiError(500, "Failed to delete playlist"))
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)){
        return res.status(400).json(new ApiError(400, "Invalid playlistId"));
    }

    try {
        const playlist = await Playlist.findById(playlistId)

        if(!playlist){
            res.status(404).json(new ApiError(404, "Playlist not found"));

         playlist.name= name
         playlist.description= description

         const updatePlaylist = await playlist.save()

         res.status(200).json(new ApiResponse(200, {data:updatePlaylist}, "Playlist updated successfully"))

        }

    } catch (error) {
        res.status(500).json(new ApiError(500, "Failed to update playlist"))
    }
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
