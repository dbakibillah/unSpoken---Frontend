import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Login from "./pages/Authentication/Login";
import Registration from "./pages/Authentication/Registration";
import CanvaSection from "./pages/canvas/CanvaSection";
import Community from "./pages/community/Community";
import Home from "./pages/home/Home";
import MainProfile from "./pages/profile/components/MainProfile";
import AuthProvider from "./providers/AuthProviders";
import Root from "./routes/Root";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/profile" element={<MainProfile />} />
            <Route path="/community" element={<Community />} />
            <Route path="/canvas" element={<CanvaSection />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
);
