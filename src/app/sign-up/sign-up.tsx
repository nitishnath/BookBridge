import { FC, useState } from "react";
import { Box, TextField } from "@mui/material";
import { Form, Field } from "react-final-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import SignUpWrapper from "./signup-wrapper";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
}

const SignUp: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: SignUpFormValues) => {
    setIsSubmitting(true);
    try {
      await register(values.username, values.email, values.password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: unknown) {
      console.error("Registration error:", error);
      toast.error(
        error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "error" in error.response.data
          ? String(error.response.data.error)
          : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const validate = (values: SignUpFormValues) => {
    const errors: ValidationErrors = {};
    if (!values.username) {
      errors.username = "Username is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <SignUpWrapper>
        <Box>
          <h2 className="text-2xl font-bold text-amber-500 mb-6 mt-10">
            Create an account
          </h2>
        </Box>
        <Form<SignUpFormValues>
          onSubmit={handleSubmit}
          validate={validate}
          render={({ handleSubmit, submitting, pristine, valid }) => (
            <form onSubmit={handleSubmit}>
              <Box className="relative mb-4">
                <Field name="username">
                  {({ input, meta }) => (
                    <div>
                      <TextField
                        {...input}
                        type="text"
                        placeholder="Enter Username"
                        className="w-full bg-[#B5B584] bg-opacity-50 rounded-lg px-4 py-3 placeholder-gray-700 text-white"
                      />
                      {meta.error && meta.touched && (
                        <span className="text-red-500 text-sm">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  )}
                </Field>
              </Box>
              <Box className="relative mb-4">
                <Field name="email">
                  {({ input, meta }) => (
                    <div>
                      <TextField
                        {...input}
                        type="email"
                        placeholder="Enter Email"
                        className="w-full bg-[#B5B584] bg-opacity-50 rounded-lg px-4 py-3 placeholder-gray-700 text-white"
                      />
                      {meta.error && meta.touched && (
                        <span className="text-red-500 text-sm">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  )}
                </Field>
                <span className="absolute right-4 top-3 text-gray-700">@</span>
              </Box>
              <Box className="relative mb-4">
                <Field name="password">
                  {({ input, meta }) => (
                    <div>
                      <TextField
                        {...input}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        className="w-full bg-[#B5B584] bg-opacity-50 rounded-lg px-4 py-3 placeholder-gray-700 text-white"
                      />
                      {meta.error && meta.touched && (
                        <span className="text-red-500 text-sm">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  )}
                </Field>
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-5 text-gray-700 cursor-pointer"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </span>
              </Box>
              <button
                type="submit"
                disabled={submitting || pristine || !valid || isSubmitting}
                className={`w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors ${
                  submitting || pristine || !valid || isSubmitting
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                }`}
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>
              <Box className="mt-6 text-center">
                <span className="text-gray-400">Already have an account? </span>
                <span
                  onClick={() => navigate("/login")}
                  className="text-amber-500 hover:underline cursor-pointer"
                >
                  Login
                </span>
              </Box>
            </form>
          )}
        />
      </SignUpWrapper>
    </>
  );
};

export default SignUp;
