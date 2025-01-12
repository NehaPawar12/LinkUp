import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {useAuthStore} from './useAuthStore.js'

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      console.log("API response:", res.data); // Debugging
  
      // Access the 'filteredUsers' property if it exists and is an array
      if (res.data && Array.isArray(res.data.filteredUsers)) {
        set({ users: res.data.filteredUsers });
      } else {
        console.error("Unexpected response format:", res.data);
        set({ users: [] }); // Reset to an empty array if the format is unexpected
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },
  
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {

    const { selectedUser, messages } = get();
    if (!selectedUser) {
        toast.error("No user selected");
        return;
    }

    const receiverId = selectedUser._id;
    try {
        console.log("Sending message to:", receiverId, "with data:", messageData);
        const res = await axiosInstance.post(`/messages/send/${receiverId}`, messageData);
        set({ messages: [...messages, res.data] });

    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        toast.error(error.response?.data?.error || "Failed to send message");
    }
},

  

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));