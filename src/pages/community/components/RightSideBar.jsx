import {
  FaFire,
  FaThumbsUp,
  FaChartBar,
  FaTags,
  FaUsers,
} from "react-icons/fa";
import { motion } from "framer-motion";

const RightSideBar = ({ posts, selectedCategory, onCategorySelect }) => {
  // Ensure posts is an array
  const safePosts = Array.isArray(posts) ? posts : [];

  // Get popular threads based on likes
  const popularThreads = [...safePosts]
    .sort((a, b) => (b.react?.totalCount || 0) - (a.react?.totalCount || 0))
    .slice(0, 3);

  // Calculate statistics
  const totalComments = safePosts.reduce(
    (total, post) => total + (post.comments?.length || 0),
    0
  );

  // Get unique members based on user email
  const uniqueMembers = new Set(
    safePosts.map((post) => post.user?.email).filter((email) => email) // Remove undefined/null emails
  ).size;

  // Extract categories with fallback to emotion
  const categories = Array.from(
    new Set(
      safePosts.map(
        (post) => post.category || post.emotion?.currentMood || "General"
      )
    )
  ).filter(Boolean);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Category color mapping
  const categoryColors = {
    General: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    "Mental Health":
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    "Daily Life":
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Relationships:
      "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    "Work & Career":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    "Health & Wellness":
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "Support & Advice":
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    // Emotion colors as fallback
    Sad: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Happy:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    Angry: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    Anxious:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    Excited:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Tired:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    Neutral: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };

  return (
    <section className="w-full md:w-80 space-y-4 sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto pb-6 scrollbar-hide">
      {/* Popular Threads Section */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/40"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <FaFire className="text-amber-500 dark:text-amber-400 animate-pulse" />
            <span>Trending Threads</span>
          </h2>
          <span className="text-xs bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 text-amber-800 dark:text-amber-200 px-2.5 py-1 rounded-full font-medium shadow-inner">
            Hot 🔥
          </span>
        </div>
        <div className="space-y-4">
          {popularThreads.length > 0 ? (
            popularThreads.map((post, index) => {
              const postCategory =
                post.category || post.emotion?.currentMood || "General";
              const likesCount = post.react?.totalCount || 0;

              return (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  className="group flex items-start gap-3 p-3 -mx-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <span
                    className={`text-sm font-bold ${
                      index === 0
                        ? "text-amber-500"
                        : index === 1
                        ? "text-gray-400"
                        : "text-amber-800/70"
                    } dark:text-gray-400 mt-0.5 min-w-[24px]`}
                  >
                    0{index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <FaThumbsUp className="h-3.5 w-3.5 mr-1" />
                        {likesCount}
                      </span>
                      <span
                        className={`capitalize px-3 py-1 rounded-full text-xs font-medium ${
                          categoryColors[postCategory] ||
                          categoryColors["General"]
                        }`}
                      >
                        {postCategory}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div variants={itemVariants} className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No trending threads yet
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Forum Statistics Section */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6"
      >
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
          <FaChartBar className="text-blue-500 dark:text-blue-400" />
          <span>Forum Insights</span>
        </h2>
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 gap-3"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-50 to-blue-100/70 dark:from-blue-900/20 dark:to-blue-900/30 p-4 rounded-xl text-center shadow-inner border border-blue-100/50 dark:border-blue-900/20"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {safePosts.length}
            </div>
            <div className="text-xs text-blue-800/80 dark:text-blue-300 mt-1 font-medium">
              Threads
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100/70 dark:from-emerald-900/20 dark:to-emerald-900/30 p-4 rounded-xl text-center shadow-inner border border-emerald-100/50 dark:border-emerald-900/20"
          >
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalComments}
            </div>
            <div className="text-xs text-emerald-800/80 dark:text-emerald-300 mt-1 font-medium">
              Responses
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-50 to-purple-100/70 dark:from-purple-900/20 dark:to-purple-900/30 p-4 rounded-xl text-center shadow-inner border border-purple-100/50 dark:border-purple-900/20"
          >
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {uniqueMembers}
            </div>
            <div className="text-xs text-purple-800/80 dark:text-purple-300 mt-1 font-medium flex items-center justify-center gap-1">
              <FaUsers className="h-3 w-3" />
              Members
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-amber-50 to-amber-100/70 dark:from-amber-900/20 dark:to-amber-900/30 p-4 rounded-xl text-center shadow-inner border border-amber-100/50 dark:border-amber-900/20"
          >
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {popularThreads.length > 0
                ? popularThreads[0].react?.totalCount || 0
                : 0}
            </div>
            <div className="text-xs text-amber-800/80 dark:text-amber-300 mt-1 font-medium">
              Top Likes
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Categories Section */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6"
      >
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-5 flex items-center gap-2">
          <FaTags className="text-primary dark:text-primary-400" />
          <span>Categories</span>
        </h2>
        <motion.div variants={containerVariants} className="space-y-2.5">
          {categories.length > 0 ? (
            categories.map((category) => {
              const count = safePosts.filter(
                (post) =>
                  (post.category || post.emotion?.currentMood || "General") ===
                  category
              ).length;

              return (
                <motion.button
                  key={category}
                  variants={itemVariants}
                  onClick={() => onCategorySelect(category)}
                  className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-primary-50/50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        categoryColors[category] || categoryColors["General"]
                      }`}
                    >
                      {category === selectedCategory && "✓ "}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        selectedCategory === category
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-400"
                      } transition-colors capitalize`}
                    >
                      {category}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      selectedCategory === category
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    } px-2.5 py-1 rounded-full transition-colors`}
                  >
                    {count}
                  </span>
                </motion.button>
              );
            })
          ) : (
            <motion.div variants={itemVariants} className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No categories available
              </p>
            </motion.div>
          )}

          {/* Clear filter button */}
          {selectedCategory && (
            <motion.button
              variants={itemVariants}
              onClick={() => onCategorySelect(null)}
              className="w-full mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Clear Filter
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RightSideBar;
