import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginUserSchema } from "../validations/staffValidators";
import { useLoginStaff } from "../hooks/useStaff";
import { Link } from "react-router-dom";
import { TextHoverEffect } from "../components/ui/text-hover-effect";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useState } from "react";
import { AxiosError } from "axios";

const Login = () => {
  const mutateLoginStaff = useLoginStaff();
  const [togglePassword, setTogglePassword] = useState(false);

  const onToggle = () => {
    setTogglePassword(!togglePassword);
  };

  // Initialize form with react-hook-form and yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginUserSchema),
  });

  // Handle form submission and trigger mutation
  const onSubmit = (data) => {
    mutateLoginStaff.mutate(data); // Trigger login mutation with form data
  };

  return (
    <div className="flex flex-col justify-center items-center w-full gap-8 bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen antialiased">
      {/* Logo Section */}
      <div className="flex items-center justify-center text-white h-80">
        <TextHoverEffect text="NEXUS" />
      </div>

      {/* Login Form */}
      <div className="  rounded-xl shadow-2xl w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-white flex flex-col gap-6"
        >
          {/* Username Input */}
          <input
            placeholder="Username"
            {...register("username")}
            type="text"
            className="px-6 py-3 rounded-lg w-full bg-gray-800 bg-opacity-70 border border-gray-600 focus:border-blue-400 focus:outline-none"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}

          {/* Password Input with Toggle */}
          <div className="relative">
            <input
              placeholder="Password"
              {...register("password")}
              type={togglePassword ? "text" : "password"}
              className="px-6 py-3 rounded-lg w-full bg-gray-800 bg-opacity-70 border border-gray-600 focus:border-blue-400 focus:outline-none"
            />
            <MdOutlineRemoveRedEye
              onClick={onToggle}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition text-white font-semibold shadow-lg"
          >
            Submit
          </button>

          {/* Loading state */}
          {mutateLoginStaff.isLoading && (
            <p className="text-yellow-400">Logging in...</p>
          )}

          {/* Error state */}
          {mutateLoginStaff.error instanceof AxiosError &&
            mutateLoginStaff.error.response?.status === 426 && (
              <p className="text-red-500">
                Login failed:{" "}
                {mutateLoginStaff.error?.response?.data?.message ||
                  "An error occurred"}
              </p>
            )}

          {/* 426 Status - Prompt to change password */}
          {mutateLoginStaff.error instanceof AxiosError &&
            mutateLoginStaff.error.response?.status === 426 && (
              <div className="text-red-500">
                <p>
                  You need to change your password before continuing. Please
                  click below:
                </p>
                <button className="mt-4 w-full py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white rounded-lg">
                  <Link to="/change-password">Change Password</Link>
                </button>
              </div>
            )}

          {/* Success state */}
          {mutateLoginStaff.isSuccess && (
            <p className="text-green-500">Login successful!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
