import { useForm } from "react-hook-form";
import {
  ChangePasswordSchema,
  StaffPassword,
} from "../validations/staffValidators";
import { yupResolver } from "@hookform/resolvers/yup";
import { useChangeStaffPassword } from "../hooks/useStaff";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useState } from "react";

const ChangePassword = () => {
  const navigate = useNavigate();
  const staffPassword = useChangeStaffPassword();
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleNewPassword, setToggleNewPassword] = useState(false);
  const [toggleRepeatPassword, setToggleRepeatPassword] = useState(false);

  const onViewPassword = () => {
    setTogglePassword(!togglePassword);
  };
  const onViewNewPassword = () => {
    setToggleNewPassword(!toggleNewPassword);
  };
  const onViewRepeatPassword = () => {
    setToggleRepeatPassword(!toggleRepeatPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffPassword>({
    resolver: yupResolver(ChangePasswordSchema),
  });

  const onSubmit = (data: StaffPassword) => {
    staffPassword.mutate(data, {
      onSuccess: () => {
        toast.success("Password successfully changed");
        setTimeout(() => {
          navigate("/");
        }, 2000); // Delay to allow the toast to show
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "An error occurred");
      },
    });
  };

  return (
    <div className="bg-gray-800 min-h-screen flex justify-center items-center bg-cover bg-center">
      <ToastContainer />
      <form
        className="flex flex-col items-center w-full max-w-md space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="input input-bordered flex items-center gap-8 mb-4 w-full">
          <input
            {...register("username")}
            type="text"
            className="grow"
            placeholder="username"
          />
          <p className="w-full text-sm text-red-500">
            {errors.username?.message}
          </p>
        </label>
        <div className="w-full relative">
          <label className="input input-bordered flex items-center gap-2 mb-4 w-full">
            <input
              {...register("password")}
              type={togglePassword ? "text" : "password"}
              className="grow"
              placeholder="password"
            />
            <MdOutlineRemoveRedEye
              onClick={onViewPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            />
            <p className="w-full text-sm text-red-500">
              {errors.password?.message}
            </p>
          </label>
        </div>

        <div className="w-full relative">
          <label className="input input-bordered flex items-center gap-2 mb-4 w-full">
            <input
              {...register("new_pass1")}
              type={toggleNewPassword ? "text" : "password"}
              className="grow"
              placeholder="new password"
            />
            <MdOutlineRemoveRedEye
              onClick={onViewNewPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            />
            <p className="w-full text-sm text-red-500">
              {errors.new_pass1?.message}
            </p>
          </label>
        </div>
        <div className="w-full relative">
          <label className="input input-bordered flex items-center gap-2 mb-4 w-full">
            <input
              {...register("new_pass2")}
              type={toggleRepeatPassword ? "text" : "password"}
              className="grow"
              placeholder="repeat password"
            />
            <MdOutlineRemoveRedEye
              onClick={onViewRepeatPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            />
            <p className="w-full text-sm text-red-500">
              {errors.new_pass2?.message}
            </p>
          </label>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
