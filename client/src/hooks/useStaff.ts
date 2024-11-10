import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginStaff,
  fetchStaff,
  addStaff,
  editStaff,
  deleteStaff,
  changePassword,
  editAdmin,
  fetchUser,
  protect,
  logoutStaff,
  fetchOneStaff,
  filterStaff,
  updateStaffPicture,
  deleteStaffPicture,
  Staff,
} from "../api/staffService";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { StaffFilters } from "../components/FilterBoxStaff";
import { AxiosError } from "axios";
import { StaffPassword } from "../validations/staffValidators";

interface ErrorResponse {
  message?: string;
}

export const useProtectRoute = () => {
  return useQuery({
    queryKey: ["dashboard-protect"],
    queryFn: protect,
    retry: 1,
  });
};
export const useLogoutStaff = () => {
  return useMutation({
    mutationFn: logoutStaff,
  });
};

// Login Staff
export const useLoginStaff = () => {
  const navigate = useNavigate();
  // Here i acces the Context API in order to acces the user details using setUser
  const { setUser } = useContext(UserContext);
  return useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      loginStaff(credentials),

    onSuccess: (data) => {
      const staff = data?.staff;

      if (staff && staff._id) {
        setUser(staff);
        navigate(`/dashboard/`);
      } else {
        console.error("User ID not found in login response.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        "Login Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Fetch staff data
export const useFetchStaff = (currentPage: number) => {
  return useQuery({
    queryKey: ["staff", currentPage],
    queryFn: () => fetchStaff(currentPage),
    staleTime: 2 * (60 * 1000), // 2 minutes
  });
};

export const useFetchUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
};

// Change Staff Password and make it Active
export const useChangeStaffPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newStaff: StaffPassword) => changePassword(newStaff), // Calling the `addStaff` function with the new staff data
    onSuccess: (data) => {
      console.log("Password successfully changed:", data);
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Invalidate to refetch staff data
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        "Changing Password Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Add a new staff member
export const useAddStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newStaff: Staff) => addStaff(newStaff), // Calling the `addStaff` function with the new staff data
    onSuccess: (data) => {
      console.log("User successfully added:", data);
      queryClient.invalidateQueries({ queryKey: ["staff"] }); // Invalidate to refetch staff data
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        "Add Staff Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Edit a staff member
export const useEditStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedStaff: Staff) => editStaff(updatedStaff),
    onSuccess: (data) => {
      console.log("Staff successfully updated:", data);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        "Edit Staff Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

export const useEditAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      updatedStaff,
    }: {
      userId: string;
      updatedStaff: Staff;
    }) => editAdmin(userId, updatedStaff),
    onSuccess: (data) => {
      console.log("Staff successfully updated:", data);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        "Edit Staff Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Update staff picture
export const useUpdateStaffPicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedPicture: File[]) => updateStaffPicture(updatedPicture),
    onSuccess: (data) => {
      console.log("Staff picture successfully updated:", data);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        "Update Picture Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Delete staff picture
export const useDeleteStaffPicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { pic: string }) => deleteStaffPicture(params.pic),

    onSuccess: (data) => {
      console.log("Staff picture successfully deleted:", data);

      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        "Delete Staff Picture Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Delete a staff member
export const useDeleteStaff = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: string) => deleteStaff(staffId), // Calling deleteStaff with staffId
    onSuccess: (data) => {
      console.log("Staff successfully deleted:", data);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      navigate(`/dashboard/staff`);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        "Delete Staff Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

// Fetch only one staff's data
export const useFetchOneStaff = (id: string) => {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => fetchOneStaff(id),
  });
};

// Filter staff
export const useFilterStaff = (filters: StaffFilters, page: number) => {
  return useQuery({
    queryKey: ["staff", filters, page],
    queryFn: () => filterStaff(filters, page),
  });
};
