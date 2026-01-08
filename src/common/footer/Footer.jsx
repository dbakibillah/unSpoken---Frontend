// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaDiscord,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-[#0d1a1a] via-[#062c2c] to-[#004d40] text-gray-200 pt-16 pb-10 px-6 md:px-16 overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,rgba(0,255,200,0.2),transparent)]"></div>

      <div className="relative z-10 grid md:grid-cols-4 gap-12 max-w-7xl mx-auto">
        {/* Brand Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-extrabold text-teal-400 mb-4">UNSPOKEN</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            Speak without words. Share emotions through colors, shapes, and patterns. Connect hearts silently.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-teal-300 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "Gallery", "My Patterns", "Community", "Contact"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-teal-400 transition">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-teal-300 mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 hover:text-teal-400 transition">
              <FaEnvelope /> <span>support@unspoken.com</span>
            </li>
            <li className="flex items-center gap-3 hover:text-teal-400 transition">
              <FaDiscord /> <span>discord.gg/unspoken</span>
            </li>
          </ul>
        </motion.div>

        {/* Social & Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-teal-300 mb-4">Stay Connected</h3>
          <div className="flex gap-4 mb-6">
            {[
              { icon: <FaFacebookF size={18} />, color: "hover:bg-blue-600" },
              { icon: <FaTwitter size={18} />, color: "hover:bg-sky-500" },
              { icon: <FaInstagram size={18} />, color: "hover:bg-pink-600" },
            ].map((item, i) => (
              <motion.a
                key={i}
                whileHover={{ scale: 1.2 }}
                className={`p-3 bg-gray-900 rounded-full transition ${item.color}`}
                href="#"
              >
                {item.icon}
              </motion.a>
            ))}
          </div>

          <form className="flex items-center bg-gray-900 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-gray-200"
            />
            <button
              type="submit"
              className="bg-teal-400 hover:bg-teal-500 px-4 py-2 text-sm font-semibold text-black transition"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-10 border-t border-gray-700 mt-12 pt-4 text-center text-sm text-gray-400"
      >
        © {new Date().getFullYear()} <span className="text-teal-400">UNSPOKEN</span>. All rights reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
