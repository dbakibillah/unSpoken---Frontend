import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Root from "./routes/Root";
import Home from "./pages/home/Home";
import AuthProvider from "./providers/AuthProviders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Authentication/Login";
import Registration from "./pages/Authentication/Registration";
import MainProfile from "./pages/profile/components/MainProfile";
import MessageSection from "./pages/chat/components/MessageSection";

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
                        <Route path="/chat" element={<MessageSection />} />
                    </Route>
                </Routes>
            </QueryClientProvider>
        </AuthProvider>
    </BrowserRouter>
);
