import axios, { type AxiosResponse } from "axios";
export enum RoomType {
  single = "single",
  double = "double",
  suite = "suite",
  pentHouse = "pentHouse",
  presidentialSuite = "presidentialSuite",
}

export enum RoomStatus {
  available = "available",
  maintenance = "maintenance",
}

export interface RoomInputs {
  room_number: string;
  room_type: RoomType;
  room_capacity: number;
  price_per_night: number;
  status: RoomStatus;
  booked_on: string[];
  description: string;
  pictures?: string[];
}

export interface Rooms {
  _id: number;
  room_number: string;
  room_type: RoomType;
  room_capacity: number;
  price_per_night: number;
  status: RoomStatus;
  booked_on: string[];
  description: string;
  pictures: string[];
}

export interface FilteredRoomsResponse {
  all_rooms: Rooms[];
  countFound: number;
}

export interface RoomUpdate {
  id: number;
  room_type: RoomType;
  room_capacity: number;
  price_per_night: number;
  status: RoomStatus;
}

export interface RoomPictureUpdate {
  id: number;
  pictures: string[];
}

// Get all Rooms
export const getRooms = async (currentPage: number): Promise<any> => {
  try {
    const url = new URL("https://nexus-management-vk4e.onrender.com/room/all");

    url.searchParams.set("page", String(currentPage + 1));
    const response = await axios.get(url, {
      withCredentials: true, // Send cookie with the request
    });

    return response.data;
  } catch (error) {
    console.error("Error getting rooms", error);
    return null;
  }
};

// Add a new ROOM
export const addRoom = async (room: RoomInputs): Promise<RoomInputs[]> => {
  try {
    const response = await axios.post(
      "https://nexus-management-vk4e.onrender.com/room/add",
      room,
      {
        withCredentials: true, // Send cookie with the request
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding Room", error);
    return null;
  }
};

// Update a ROOM
export const updateRoom = async (
  id: number,
  input: Partial<RoomUpdate>
): Promise<RoomUpdate> => {
  try {
    const response = await axios.put(
      `https://nexus-management-vk4e.onrender.com/room/update/${id}`,
      input,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error update Room", error);
    return null;
  }
};

// Update Pictures for a specific Room
export const updatePictures = async (
  id: number,
  pictures: File[]
): Promise<any> => {
  try {
    const formData = new FormData();

    // Append each picture to FormData
    for (let i = 0; i < pictures.length; i++) {
      formData.append("picture", pictures[i]);
    }

    const response = await axios.post(
      `https://nexus-management-vk4e.onrender.com/room/pic-upload/${id}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error Update Pictures", error);
    return null;
  }
};

// Delete pictures of a specific room
export const deletePictures = async (
  id: number,
  pictures: string[]
): Promise<any> => {
  try {
    const response = await axios.delete(
      `https://nexus-management-vk4e.onrender.com/room/pic-delete/${id}`,
      {
        data: { pictures },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete Pictures", error);
    return null;
  }
};

// Delete a specific room
export const deleteRoom = async (id: string) => {
  try {
    const response = await axios.delete(
      `https://nexus-management-vk4e.onrender.com/room/delete/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete Room", error);
    return null;
  }
};

// Fetch a specific room
export const fetchOneRoom = async (id: string) => {
  try {
    const response = await axios.get(
      `https://nexus-management-vk4e.onrender.com/room/one/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Fetch room", error);
    return null;
  }
};

// check available rooms

export const checkAvailableRooms = async (input) => {
  try {
    const response = await axios.post(
      `https://nexus-management-vk4e.onrender.com/room/check-rooms`,
      input,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Fetch room", error);
    return null;
  }
};

// filter rooms

export const filterRooms = async (filters, page: number) => {
  try {
    const url = new URL(
      "https://nexus-management-vk4e.onrender.com/room/all/filter"
    );

    url.searchParams.set("page", String(page));
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      url.searchParams.set(key, value);
    });

    const response = await axios.get<
      null,
      AxiosResponse<FilteredRoomsResponse>
    >(url, {
      withCredentials: true,
    });

    const { all_rooms, countFound } = response.data;
    const totalPages = Math.ceil(countFound / 5);

    return {
      rooms: all_rooms,
      pagination: {
        currentPage: page,
        totalPages,
        isFirstPage: page === 1,
        isLastPage: page === totalPages,
      },
    };
  } catch (error) {
    console.error("Error filter room", error);
    return null;
  }
};
