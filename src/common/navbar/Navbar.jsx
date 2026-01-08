import { useContext, useEffect, useRef, useState } from "react";
import {
  BsBoxArrowRight,
  BsGrid3X3Gap,
  BsHeartPulse,
  BsList,
  BsScissors,
} from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, NavLink } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProviders";

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const servicesRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    signOutUser()
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: "Logged out successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
        });
      });
  };

  const services = [
    { name: "Pet Grooming", path: "/grooming", icon: <BsScissors /> },
    { name: "Healthcare", path: "/healthcare", icon: <BsHeartPulse /> },
  ];

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${
              isActive
                ? "text-white bg-linear-to-r from-teal-500 to-green-800 shadow-lg"
                : "text-gray-700 hover:bg-gray-50 hover:text-teal-500"
            }`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/canvas"
          className={({ isActive }) =>
            `px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${
              isActive
                ? "text-white bg-linear-to-r from-teal-500 to-green-800 shadow-lg"
                : "text-gray-700 hover:bg-gray-50 hover:text-teal-500"
            }`
          }
        >
          Canvas
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${
                isActive
                  ? "text-white bg-linear-to-r from-teal-500 to-green-800 shadow-lg"
                  : "text-gray-700 hover:bg-gray-50 hover:text-teal-500"
              }`
            }
          >
            Chat💬
          </NavLink>
        </li>
      )}
      {user && (
        <li>
          <NavLink
            to="/community"
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${
                isActive
                  ? "text-white bg-linear-to-r from-teal-500 to-green-800 shadow-lg"
                  : "text-gray-700 hover:bg-gray-50 hover:text-teal-500"
              }`
            }
          >
            Community
          </NavLink>
        </li>
      )}

      <li className="relative" ref={servicesRef}>
        <button
          onClick={() => setServicesOpen(!servicesOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${
            servicesOpen
              ? "text-white bg-linear-to-r from-teal-500 to-green-800 shadow-lg"
              : "text-gray-700 hover:bg-gray-50 hover:text-teal-500"
          }`}
        >
          Services
          <IoMdArrowDropdown
            className={`transition-transform duration-300 text-lg ${
              servicesOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`absolute left-0 top-full mt-3 w-64 origin-top-left rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 focus:outline-none transition-all duration-300 z-50 overflow-hidden ${
            servicesOpen
              ? "opacity-100 scale-100 translate-y-0 visible"
              : "opacity-0 scale-95 -translate-y-2 invisible"
          }`}
        >
          {services.map((service) => (
            <NavLink
              key={service.path}
              to={service.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-teal-500/10 text-teal-500 border-l-4 border-teal-500"
                    : "text-gray-700 hover:bg-gray-50 hover:pl-5 hover:text-teal-500"
                }`
              }
              onClick={() => setServicesOpen(false)}
            >
              <span className="mr-3 text-lg text-teal-500">{service.icon}</span>
              {service.name}
            </NavLink>
          ))}
        </div>
      </li>
    </>
  );

  return (
    <nav className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 p-2">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <div className="lg:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-300 hover:shadow-md"
            >
              <BsList className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start">
            <Link to="/" className="flex items-center space-x-3 group">
              <figure className="w-40 transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-linear-to-br from-teal-500 to-green-800 rounded-lg"></div>
                  <span class="text-xl font-bold bg-linear-to-br from-teal-500 to-green-800 bg-clip-text text-transparent">
                    unSpoken
                  </span>
                </div>
              </figure>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center space-x-2">{navLinks}</ul>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="cursor-pointer group">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-teal-500 group-hover:ring-offset-2 ring-offset-white transition-all duration-300">
                      <img
                        src={
                          user.photoURL ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                        }
                        alt="User Avatar"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 p-3 shadow-2xl menu dropdown-content bg-white rounded-2xl w-72 space-y-2 border border-gray-100 z-50"
                >
                  <li className="px-4 py-4 bg-linear-to-r from-gray-50 to-white rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-teal-500/30">
                        <img
                          src={
                            user.photoURL ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                          }
                          alt="User Avatar"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-base">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email || "Welcome back!"}
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-teal-500/5 hover:text-teal-500 rounded-lg transition-all duration-300 hover:pl-5"
                      onClick={() => document.activeElement.blur()}
                    >
                      <BsGrid3X3Gap className="w-5 h-5 mr-3 text-teal-500" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-300 hover:pl-5"
                    >
                      <BsBoxArrowRight className="w-5 h-5 mr-3" />
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-8 py-3 rounded-full bg-linear-to-r from-teal-500 via-teal-500/90 to-green-800 text-white font-semibold hover:from-green-800 hover:to-teal-500 hover:shadow-xl transition-all duration-500 shadow-lg hover:-translate-y-0.5 transform"
                >
                  Login
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ${
            mobileMenuOpen
              ? "max-h-96 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-4 overflow-hidden"
          }`}
        >
          <div className="py-6 px-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 mt-4">
            <ul className="space-y-2">{navLinks}</ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
