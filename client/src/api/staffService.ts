import axios, { AxiosResponse, AxiosError } from "axios";
import { Role, StaffPassword } from "../validations/staffValidators";
import { StaffFilters } from "../components/FilterBoxStaff";

// Interface for the login credentials (what you send to the server)
export interface LoginCredentials {
  username: string;
  password: string;
}

// Interface for the login response (what you expect back from the server)
export interface LoginResponse {
  token: string;
  staff: {
    _id: string;
    username: string;
    role: string;
  };
}

export interface Staff {
  _id: string;
  name: string;
  username: string;
  role: string;
  activated: boolean;
  pic: string;
}

export interface FilteredStaffResponse {
  staff: Staff[];
  countFound: number;
}

export interface Inputs {
  name: string;
  username: string;
  password: string;
  role: Role;
  phone: string;
  address: string;
  photo?: FileList;
}

export const protect = async () => {
  try {
    const response = await axios.get(
      "https://nexus-management-vk4e.onrender.com/dashboard",
      {
        withCredentials: true, // Send cookie with the request
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Now you can safely access error.response
      console.error(
        "Error fetching protected route:",
        error.response?.data || error.message
      );
    } else {
      // Handle non-Axios errors
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const changePassword = async (credentials: StaffPassword) => {
  const response = await axios.post(
    "https://nexus-management-vk4e.onrender.com/staff/activate",
    credentials,
    { withCredentials: true }
  );
  return response.data;
};

// Login function with proper typing for both request and response
export const loginStaff = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  // Expecting LoginResponse from the server
  const response = await axios.post(
    "https://nexus-management-vk4e.onrender.com/staff/login",
    credentials, // Passing the credentials to the API
    { withCredentials: true } // Ensure cookies are sent
  );
  return response.data;
};

// Fetch all staff members
export const fetchStaff = async (currentPage: number): Promise<Staff[]> => {
  try {
    const url = new URL("https://nexus-management-vk4e.onrender.com/staff/all");
    url.searchParams.set("page", String(currentPage + 1));

    const response = await axios.get(url.toString(), {
      withCredentials: true,
    });
    return response.data.users;
  } catch (error) {
    console.error("Error getting staff", error);
    return [];
  }
};
export const fetchUser = async () => {
  const response = await axios.get(
    "https://nexus-management-vk4e.onrender.com/staff/profile",
    {
      withCredentials: true,
    }
  );
  return response.data.staff;
};

// Add new staff
export const addStaff = async (newStaff: Staff): Promise<Inputs[]> => {
  const response = await axios.post(
    "https://nexus-management-vk4e.onrender.com/staff/add",
    newStaff,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Edit existing staff
export const editStaff = async (updatedStaff: Staff) => {
  const response = await axios.put(
    `https://nexus-management-vk4e.onrender.com/staff/update/`,
    updatedStaff,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const editAdmin = async (userId: string, updatedStaff: Staff) => {
  console.log("Sending Data:", userId, updatedStaff); // Log the data before sending
  try {
    const response = await axios.put(
      `https://nexus-management-vk4e.onrender.com/staff/master-update/${userId}`,
      updatedStaff,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Safely log the Axios-specific error
      console.error("Error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

// Update Picture of a specific Staff
export const updateStaffPicture = async (
  pictureFileList: File[]
): Promise<any> => {
  try {
    const formData = new FormData();
    const picture = pictureFileList[0];
    if (!picture) {
      console.error("No file selected");
      return;
    }
    formData.append("picture", picture);
    console.log(formData.get("picture"));
    const response = await axios.post(
      `https://nexus-management-vk4e.onrender.com/staff/pic-upload`,
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
    if (error instanceof AxiosError) {
      console.error(
        "Error updating picture:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
};

// Delete picture of a specific staff
export const deleteStaffPicture = async (pic: string): Promise<any> => {
  try {
    const response = await axios.delete(
      `https://nexus-management-vk4e.onrender.com/staff/pic-delete`,
      {
        data: { pic },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Deleting Picture", error);
    return null;
  }
};

// Delete a staff member
export const deleteStaff = async (staffId: string) => {
  const response = await axios.delete(
    `https://nexus-management-vk4e.onrender.com/staff/delete/${staffId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Fetch one staff member
export const fetchOneStaff = async (staffId: string): Promise<Staff[]> => {
  const response = await axios.get(
    `https://nexus-management-vk4e.onrender.com/staff/one/${staffId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Logout

export const logoutStaff = async () => {
  const response = await axios.post(
    "https://nexus-management-vk4e.onrender.com/staff/logout",
    {}, // Empty body if no data is being sent
    {
      withCredentials: true, // This goes in the config object, not the request body
    }
  );
  return response.data;
};

// filter Staff

export const filterStaff = async (staffFilters: StaffFilters, page: number) => {
  try {
    const url = new URL(
      "https://nexus-management-vk4e.onrender.com/staff/all/filter"
    );

    url.searchParams.set("page", String(page));
    Object.entries(staffFilters).forEach(([key, value]) => {
      if (!value) return;

      url.searchParams.set(key, String(value));
    });

    const response = await axios.get<
      null,
      AxiosResponse<FilteredStaffResponse>
    >(url.toString(), {
      withCredentials: true,
    });

    const { staff, countFound } = response.data;
    const totalPages = Math.ceil(countFound / 5);

    return {
      staff: staff,
      pagination: {
        currentPage: page,
        totalPages,
        isFirstPage: page === 1,
        isLastPage: page === totalPages,
      },
    };
  } catch (error) {
    console.error("Error filter staff", error);
    return null;
  }
};
