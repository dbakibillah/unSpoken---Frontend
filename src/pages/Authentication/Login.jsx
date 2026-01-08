import "animate.css";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../providers/AuthProviders";

const Login = () => {
    const axiosPublic = useAxiosPublic();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { signInUser, setUser, googleSignIn } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(async (result) => {
                const user = result.user;
                setUser(user);

                const newUser = {
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                };

                try {
                    const response = await axiosPublic.get(
                        `user?email=${user.email}`
                    );
                    if (response.data.exists) {
                        Swal.fire({
                            title: "Welcome back!",
                            text: "You are already registered.",
                            icon: "info",
                        });
                        navigate(location.state?.from?.pathname || "/", {
                            replace: true,
                        });
                    } else {
                        await axiosPublic.post("users", newUser);
                        Swal.fire({
                            title: "Good job!",
                            text: "Registration successfully with Google!",
                            icon: "success",
                        });
                        navigate(location.state?.from?.pathname || "/", {
                            replace: true,
                        });
                    }
                    navigate(location.state?.from?.pathname || "/", {
                        replace: true,
                    });
                } catch (error) {
                    console.error("Error handling Google sign-in:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Something went wrong!",
                        text: error.message,
                    });
                }
            })
            .catch((err) => {
                Swal.fire({
                    title: "Something went wrong!",
                    text: err.message,
                    icon: "error",
                });
            });
    };

    const onSubmit = (data) => {
        const { email, password } = data;

        signInUser(email, password)
            .then((result) => {
                setUser(result.user);
                const redirectPath = location.state || "/";
                navigate(redirectPath, { replace: true });
                Swal.fire({
                    title: "Good job!",
                    text: "Logged in successfully!",
                    icon: "success",
                });
            })
            .catch((err) => {
                Swal.fire({
                    title: "Something went wrong!",
                    text: err.message,
                    icon: "error",
                });
            });
    };

    return (
        <section className="py-36 flex items-center justify-center">
            <Helmet>
                <title>Login | petVerse</title>
            </Helmet>

            <div className="card w-full max-w-sm shadow-2xl p-6 py-10 bg-white dark:bg-gray-800 rounded-2xl animate__animated animate__bounceInDown animate__slow">
                <h2 className="text-4xl font-bold text-center text-c3 dark:text-white mb-6">
                    Welcome
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email Field */}
                    <div className="space-y-1">
                        <label className="label text-base text-gray-700 dark:text-gray-200">
                            Email
                        </label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                            })}
                            type="email"
                            placeholder="Enter your email"
                            className="input w-full dark:bg-gray-700 dark:text-white"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label className="label text-base text-gray-700 dark:text-gray-200">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters long",
                                    },
                                })}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="input w-full pr-10 dark:bg-gray-700 dark:text-white"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 cursor-pointer text-gray-500 text-xl"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="btn w-full rounded-full text-white bg-gradient-to-r from-secondary to-primary hover:bg-gradient-to-l shadow-md border-none"
                    >
                        Login
                    </button>

                    {/* Google Sign-in */}
                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="btn w-full rounded-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-black dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white shadow-md border-none"
                    >
                        <img
                            src="https://i.ibb.co/WnqDNrk/google.png"
                            alt="Google Icon"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
                        Don’t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-primary font-bold hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Login;
