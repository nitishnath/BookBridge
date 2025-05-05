import { FC } from "react";
import { Box } from "@mui/material";

const SignUpWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box className="min-h-screen flex">
      {/* Left side with illustration */}
      <Box className="w-1/2 bg-black relative">
        <img src="/logo.png" alt="BookBridge Logo" className="h-8" />
      </Box>
      {/* Right side with login form */}
      <Box className="w-1/2 bg-black p-12 flex flex-col">
        <Box className="max-w-md w-full mx-auto space-y-8">
          <Box className="text-center">
            <h1 className="text-4xl font-bold text-amber-500 mb-4">
              Welcome to Book Bridge!
            </h1>
            <p className="text-gray-300 text-sm">
              Discover a seamless way to sell your books and unlock exclusive
              benefits. Enjoy a hassle-free experience, save valuable time, and
              take advantage of our amazing offers.
            </p>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpWrapper;
