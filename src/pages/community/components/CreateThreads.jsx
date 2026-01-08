import { useContext, useState } from "react";
import { toast } from "react-toastify";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { AuthContext } from "../../../providers/AuthProviders";

const CreateThreads = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    postTitle: "",
    postDescription: "",
    tags: "",
    category: "",
    currentMood: "Neutral",
    emoji: "😊",
    intensity: 5,
    visibility: "public",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Emoji options for different moods
  const moodOptions = [
    { value: "Happy", emoji: "😊", label: "Happy" },
    { value: "Sad", emoji: "😔", label: "Sad" },
    { value: "Angry", emoji: "😠", label: "Angry" },
    { value: "Anxious", emoji: "😰", label: "Anxious" },
    { value: "Excited", emoji: "🎉", label: "Excited" },
    { value: "Tired", emoji: "😴", label: "Tired" },
    { value: "Neutral", emoji: "😐", label: "Neutral" },
  ];

  const emojiMap = {
    Happy: "😊",
    Sad: "😔",
    Angry: "😠",
    Anxious: "😰",
    Excited: "🎉",
    Tired: "😴",
    Neutral: "😐",
  };

  const handleMoodChange = (mood) => {
    setFormData((prev) => ({
      ...prev,
      currentMood: mood,
      emoji: emojiMap[mood] || "😊",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to create a post", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Process data to match BACKEND structure (not frontend display structure)
      const processedData = {
        // Backend expects these exact field names
        postTitle: formData.postTitle,
        postDescription: formData.postDescription,
        authorName: user.displayName || user.name || "Anonymous",
        authorEmail: user.email,
        authorImg:
          user.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg",

        // Emotion data
        emotion: {
          currentMood: formData.currentMood,
          emoji: formData.emoji,
          intensity: parseInt(formData.intensity),
        },

        // Tags as array
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),

        // Category
        category: formData.category,

        // Visibility
        visibility: formData.visibility,

        // Metadata - match backend expectations
        react: {
          totalCount: 0,
        },
        comments: [],
        likedBy: [], // Backend expects this field for likes
        likesCount: 0, // Backend expects this field
        createdAt: new Date().toISOString(),
      };

      console.log("Sending data to backend:", processedData);

      // Send to correct endpoint
      const response = await axiosPublic.post("/forums/create", processedData);

      if (response.data.success) {
        toast.success("Post created successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "light",
        });

        // Reset form
        setShowForm(false);
        setFormData({
          postTitle: "",
          postDescription: "",
          tags: "",
          category: "",
          currentMood: "Neutral",
          emoji: "😊",
          intensity: 5,
          visibility: "public",
        });

        // Refresh the posts list
        refetch();
      } else {
        throw new Error(response.data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.message || "Failed to create post. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto max-sm:px-2">
      {/* Header with gradient background */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-gradient-to-r from-green-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm mb-4 gap-4 sm:gap-0">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Community Forum
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
            Share your feelings, thoughts, and connect with others
          </p>
        </div>
        <button
          onClick={() => {
            if (!user) {
              toast.info("Please login to create a post", {
                position: "top-center",
                autoClose: 3000,
              });
              return;
            }
            setShowForm(true);
          }}
          className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create Post
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-lg p-4 sm:p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => !isSubmitting && setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl disabled:opacity-50"
              disabled={isSubmitting}
            >
              &times;
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <img
                src={
                  user?.photoURL ||
                  "https://randomuser.me/api/portraits/lego/1.jpg"
                }
                alt="Author"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-green-500"
              />
              <div>
                <p className="font-semibold text-base sm:text-lg text-gray-800 dark:text-white">
                  {user?.displayName || user?.name || "Anonymous"}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {user?.email}
                </p>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Share Your Thoughts
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Title *
                </label>
                <input
                  type="text"
                  name="postTitle"
                  value={formData.postTitle}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="What's on your mind?"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Description *
                </label>
                <textarea
                  name="postDescription"
                  value={formData.postDescription}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={5}
                  placeholder="Share your thoughts, feelings, or experiences..."
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 text-sm sm:text-base"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Mood */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    How are you feeling? *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => handleMoodChange(mood.value)}
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          formData.currentMood === mood.value
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-2 border-green-500"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                        disabled={isSubmitting}
                      >
                        <span className="text-lg">{mood.emoji}</span>
                        <span className="text-sm">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensity */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Intensity: {formData.intensity}/10
                  </label>
                  <input
                    type="range"
                    name="intensity"
                    min="1"
                    max="10"
                    value={formData.intensity}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tags */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g. anxiety, support, advice"
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 text-sm sm:text-base"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 text-sm sm:text-base"
                  >
                    <option value="">Select a category</option>
                    <option value="General">General</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Daily Life">Daily Life</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Work & Career">Work & Career</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Support & Advice">Support & Advice</option>
                  </select>
                </div>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Visibility
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={formData.visibility === "public"}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="text-green-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Public
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={formData.visibility === "private"}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="text-green-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Private
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => !isSubmitting && setShowForm(false)}
                  disabled={isSubmitting}
                  className="px-3 sm:px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-70 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 sm:px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Share Post"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CreateThreads;
