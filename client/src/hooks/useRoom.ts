import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// this will change after api/roomService is completed
import {
  getRooms,
  addRoom,
  updateRoom,
  updatePictures,
  deletePictures,
  deleteRoom,
  fetchOneRoom,
  checkAvailableRooms,
  filterRooms,
} from "../api/roomsService";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Filters } from "../components/FilterBox";

// Fetch rooms
export const useFetchRooms = (currentPage: number) => {
  return useQuery({
    queryKey: ["room", currentPage],
    queryFn: () => getRooms(currentPage),
  });
};

// Add a new room
export const useAddRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newRoom) => addRoom(newRoom), // Calling the `addRoom` function with the new room data
    onSuccess: (data) => {
      console.log("Room successfully added:", data);
      queryClient.invalidateQueries({ queryKey: ["room"] }); // Invalidate to refetch room data
    },
    onError: (error) => {
      console.error(
        "Add Room Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Update a room data
export const useUpdateRoom = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updatedRoom }) => updateRoom(id, updatedRoom),
    onSuccess: (data) => {
      console.log("Room successfully updated:", data);
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
    onError: (error) => {
      console.error(
        "Update Room Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Update a room's pictures
export const useUpdatePictures = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedPictures: File[]) =>
      updatePictures(id, updatedPictures),
    onSuccess: (data) => {
      console.log("Room pictures successfully updated:", data);
      queryClient.invalidateQueries({ queryKey: ["room", id] });
    },
    onError: (error) => {
      console.error(
        "Update Pictures Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Delete a room
export const useDeleteRoom = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoom(id), // Accept id dynamically
    onSuccess: (data) => {
      console.log("Room successfully deleted:", data);
      queryClient.invalidateQueries({ queryKey: ["room"] });
      navigate(`/dashboard/rooms`);
    },
    onError: (error) => {
      console.error(
        "Delete Room Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Delete pictures of a room
export const useDeletePictures = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pictures }) => deletePictures(id, pictures), // Accept id and pictures array
    onSuccess: (data, variables) => {
      console.log("Room pictures successfully deleted:", data);
      // Invalidate the specific room query
      queryClient.invalidateQueries({ queryKey: ["room", variables.id] });
    },
    onError: (error) => {
      console.error(
        "Delete Room Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

export const useAvailableRooms = () => {
  const { setSearchedRooms } = useContext(UserContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input) => checkAvailableRooms(input), // Accept id dynamically
    onSuccess: (data) => {
      console.log("Rooms founded:", data);
      setSearchedRooms(data);
      queryClient.invalidateQueries({ queryKey: ["room"] });
      navigate(`/dashboard/rooms/available`);
    },
    onError: (error) => {
      console.error(
        "Delete Room Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Fetch only one room's data
export const useFetchOneRoom = (id: string) => {
  return useQuery({
    queryKey: ["room", id],
    queryFn: () => fetchOneRoom(id),
  });
};

// Filter rooms
export const useFilterRoom = (filters: Filters, page: number) => {
  return useQuery({
    queryKey: ["room", filters, page],
    queryFn: () => filterRooms(filters, page),
  });
};
