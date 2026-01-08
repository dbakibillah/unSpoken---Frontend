import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../providers/AuthProviders";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Helmet } from "react-helmet";

const Registration = () => {
    const img_hosting_key = import.meta.env.VITE_IMG_HOSTING_KEY;
    const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const { createUser, setUser, updateUserProfile, googleSignIn } =
        useContext(AuthContext);
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
                        `/user?email=${user.email}`
                    );
                    if (response.data.exists) {
                        Swal.fire({
                            title: "Welcome back!",
                            text: "You are already registered.",
                            icon: "info",
                        });
                        navigate("/");
                    } else {
                        await axiosPublic.post("/users", newUser);
                        Swal.fire({
                            title: "Good job!",
                            text: "Registration successful with Google!",
                            icon: "success",
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

    const onSubmit = async (data) => {
        const { name, email, password } = data;

        try {
            const response = await axiosPublic.get(`/user?email=${email}`);
            if (response.data.exists) {
                Swal.fire({
                    title: "Already registered!",
                    text: "Please log in instead.",
                    icon: "info",
                });
                navigate("/login");
                return;
            }

            const result = await createUser(email, password);
            setUser(result.user);

            const formData = new FormData();
            formData.append("image", data.photo[0]);
            const imgResponse = await axiosPublic.post(
                img_hosting_api,
                formData
            );

            if (!imgResponse.data.success) {
                Swal.fire({
                    icon: "error",
                    title: "Image Upload Failed",
                    text: "Please try again.",
                });
                return;
            }

            const updateUser = {
                displayName: name,
                photoURL: imgResponse.data.data.display_url,
            };
            await updateUserProfile(updateUser);

            const newUser = { name, email, photo: updateUser.photoURL };
            await axiosPublic.post("/users", newUser);

            navigate("/");
            Swal.fire({
                title: "Good job!",
                text: "Registration successful!",
                icon: "success",
            });
        } catch (error) {
            console.error("Error during registration:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to register",
                text: error.message,
            });
        }
    };

    return (
        <section className="px-4 py-16 flex items-center justify-center">
            <Helmet>
                <title>Registration | petVerse</title>
            </Helmet>

            <div className="w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 py-10 animate__animated animate__bounceInDown animate__slow">
                <h2 className="text-4xl font-bold text-center text-c3 dark:text-white mb-8">
                    Create an Account
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                            {...register("name", {
                                required: "Name is required.",
                            })}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                            {...register("email", {
                                required: "Email is required.",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email format.",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Photo */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-1">
                            Photo
                        </label>
                        <input
                            type="file"
                            className="file-input file-input-bordered w-full dark:bg-gray-700 dark:text-white"
                            {...register("photo", {
                                required: "Photo is required.",
                            })}
                        />
                        {errors.photo && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.photo.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="input input-bordered w-full pr-10 dark:bg-gray-700 dark:text-white"
                                {...register("password", {
                                    required: "Password is required.",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters.",
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                                        message:
                                            "Must include uppercase, lowercase, number & special character.",
                                    },
                                })}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-3 right-3 text-xl text-gray-500 cursor-pointer"
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

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="w-full py-2 rounded-full text-white bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary transition-all duration-300 shadow-md"
                    >
                        Register
                    </button>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="w-full py-2 rounded-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-black dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-all duration-300 shadow-md"
                    >
                        <img
                            src="https://i.ibb.co/WnqDNrk/google.png"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>

                    {/* Login Redirect */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-primary font-bold hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Registration;
