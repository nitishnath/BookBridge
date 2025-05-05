import { FC, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Box, TextField } from "@mui/material";
import { Form, Field } from "react-final-form";
import SignUpWrapper from "../sign-up/signup-wrapper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ValidationErrors {
  email?: string;
  password?: string;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validate = (values: LoginFormValues) => {
    const errors: ValidationErrors = {};
    if (!values.email) {
      errors.email = "Email is required";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <Form<LoginFormValues>
        validate={validate}
        onSubmit={handleSubmit}
        render={({ handleSubmit, submitting, pristine, valid }) => (
          <form onSubmit={handleSubmit}>
            <SignUpWrapper>
              <Box>
                <h2 className="text-2xl font-bold text-amber-500 mb-6">
                  Login to Your Account!
                </h2>
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
                  <span className="absolute right-4 top-3 text-gray-700">
                    @
                  </span>
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

                <Box className="text-right">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-amber-500 text-sm"
                  >
                    Forgot Password?
                  </a>
                </Box>
                <Box className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    disabled={submitting || pristine || !valid || isSubmitting}
                    className={`w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors ${
                      submitting || pristine || !valid || isSubmitting
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center space-x-2 border border-gray-600 py-3 rounded-lg text-white hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <FcGoogle size={24} />
                    <span>Login with Google</span>
                  </button>
                </Box>
                <Box className="mt-6 text-center">
                  <span className="text-gray-400">
                    Don't you have an account?{" "}
                  </span>
                  <span
                    onClick={() => navigate("/sign-up")}
                    className="text-amber-500 hover:underline cursor-pointer"
                  >
                    Create an account
                  </span>
                </Box>
              </Box>
            </SignUpWrapper>
          </form>
        )}
      />
    </>
  );
};

export default Login;
