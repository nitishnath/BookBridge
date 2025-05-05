import { FC, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

// Component imports
import App from "../App";
import Login from "./login/login";
import SignUp from "./sign-up/sign-up";
import Home from "./home/home";

// Loading spinner component
const LoadingSpinner: FC = () => (
  <Box className="flex justify-center items-center h-screen">
    <Box className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand">
      {/* <img src={logo} alt="logo" className="h-full w-full" /> */}
      <CircularProgress />
    </Box>
  </Box>
);

export const AppRoutes: FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
