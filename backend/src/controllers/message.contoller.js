import User from '../models/user.model.js'
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import {io, getReceiverSocketId } from '../lib/socket.js';

export const getUsersForSidebar = async (req, res) => {
    //Here we want to fetch every user except

    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password")

        res.status(200).json({filteredUsers})
    } catch (error) {
        console.error("Error in getUsersFroSidebar ",error.message);

        res.status(500).json({error: "Internal server error"})
    }
};

export const getMessages = async(req, res) => {

    try {
       const {id : userToChatId} =  req.params
       const myId = req.user._id;

       const messages = await Message.find({
        $or: [
            {senderId : myId, receiverId : userToChatId},
            {senderId : userToChatId, receiverId : myId}
        ]
       })

       res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages Controller: ", error.message);
        res.status(500).json({error: "Internal server error"})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params; // Extract receiverId from URL params
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // Upload base64 image to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        console.log("new")
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        console.log(imageUrl)
        await newMessage.save();

        // Emit the message to the receiver via socket if online
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log(receiverSocketId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessageController:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
