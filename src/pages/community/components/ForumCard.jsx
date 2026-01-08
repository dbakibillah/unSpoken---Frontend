import {
  HiOutlineCheckCircle,
  HiOutlineChatAlt2,
  HiOutlineUserCircle,
  HiOutlineHeart,
} from "react-icons/hi";
import { formatDistanceToNow } from "date-fns";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import CommentsContainer from "./CommentsContainer";
import { motion } from "framer-motion";
import { AuthContext } from "../../../providers/AuthProviders";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const ForumCard = ({ post, refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  // Adapt field names to match your data structure
  const [liked, setLiked] = useState(
    post.likedBy?.includes(user?.email) || false
  );
  const [likesCount, setLikesCount] = useState(post.react?.totalCount || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  // Emotion color mapping based on mood
  const emotionColors = {
    Sad: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Happy:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    Angry: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    Anxious:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    Neutral: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    Excited:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Tired:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  };

  // Default colors for other categories if needed
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
  };

  const handleLike = async () => {
    if (!user) {
      toast.info("Please login to like posts", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsAnimating(true);

    try {
      // Fixed API endpoint - should be /forums/ instead of /threads/
      const response = await axiosPublic.patch(`/forums/like/${post._id}`, {
        userEmail: user.email,
      });

      const {
        success,
        liked: isLiked,
        likesCount: updatedLikesCount, // Changed from totalCount to likesCount
      } = response.data;

      if (success) {
        setLiked(isLiked);
        setLikesCount(updatedLikesCount);
        toast.success(isLiked ? "Post liked!" : "Like removed", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      refetch();
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast.info("Please write a comment", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!user) {
      toast.info("Please login to comment", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const newComment = {
      commentId: `cmt_${Date.now()}`,
      text: commentText,
      createdAt: new Date().toISOString(),
      user: {
        name: user.displayName || user.name || "Anonymous",
        email: user.email,
        photo: user.photoURL || post.authorImg || null,
      },
    };

    try {
      // Fixed API endpoint - should be /forums/ instead of /threads/
      const response = await axiosPublic.patch(`/forums/comment/${post._id}`, {
        newComment,
      });

      if (response.data.success) {
        setComments((prev) => [...prev, newComment]);
        setCommentText("");
        setShowCommentForm(false);

        toast.success("Comment added successfully", {
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
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast.error("Failed to add comment", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      refetch();
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 dark:bg-gray-900/80 dark:border-gray-700 dark:hover:border-primary/40">
      {/* Header */}
      <div className="flex items-center gap-5 mb-5">
        {/* User image */}
        <div className="flex-shrink-0 z-10">
          {post.authorImg ? (
            <img
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/20 hover:ring-primary/70 hover:ring-5 transition-all duration-400 dark:ring-primary/30 dark:hover:ring-primary/50"
              src={post.authorImg}
              alt={post.authorName}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.innerHTML =
                  '<HiOutlineUserCircle className="w-12 h-12 text-gray-400 hover:text-primary transition-colors duration-200 dark:text-gray-500" />';
              }}
            />
          ) : (
            <HiOutlineUserCircle className="w-12 h-12 text-gray-400 hover:text-primary transition-colors duration-200 dark:text-gray-500" />
          )}
        </div>

        <div className="z-10 w-full flex justify-between items-center">
          {/* User info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg group text-start">
              <span className="group-hover:text-primary transition-colors duration-200">
                {post.authorName || "Anonymous"}
              </span>
            </h3>
            <p className="text-gray-400 text-start text-sm dark:text-gray-400">
              {post.authorEmail} • {formattedDate}
            </p>

            {/* Tags display */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full dark:bg-gray-700 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Emotion/Category badge */}
          <div className="flex flex-col items-end gap-2">
            {post.emotion && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{post.emotion.emoji || "😊"}</span>
                <span
                  className={`capitalize px-3 py-1 rounded-full text-xs font-medium ${
                    emotionColors[post.emotion.currentMood] ||
                    categoryColors[post.category] ||
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {post.emotion.currentMood || post.category}
                </span>
              </div>
            )}

            {/* Intensity indicator */}
            {post.emotion?.intensity && (
              <div className="flex items-center gap-1">
                <div className="w-24 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${(post.emotion.intensity / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {post.emotion.intensity}/10
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-5 group">
        <h2 className="text-xl text-start font-bold text-gray-900 dark:text-white mb-3 hover:text-primary transition-colors duration-200 cursor-pointer">
          {post.postTitle}
        </h2>
        <div className="text-gray-600 dark:text-gray-300 text-sm text-start space-y-2 leading-relaxed">
          {post.postDescription &&
            post.postDescription.split("\n").map((paragraph, i) => (
              <p
                key={i}
                className="hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
              >
                {paragraph}
              </p>
            ))}
        </div>
      </div>

      {/* Footer with stats */}
      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
        <div className="flex items-center gap-4">
          {/* Like button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm transition-colors duration-200 ${
              liked
                ? "text-red-500"
                : "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
            }`}
            disabled={!user || isAnimating}
            title={!user ? "Please login to like" : ""}
          >
            <motion.div
              animate={{
                scale: isAnimating ? [1, 1.5, 1] : 1,
                rotate: isAnimating ? [0, -10, 10, 0] : 0,
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
              onAnimationComplete={() => setIsAnimating(false)}
            >
              <HiOutlineHeart
                className={`w-5 h-5 transition-transform duration-200 hover:scale-110 ${
                  liked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </motion.div>
            <motion.span
              key={likesCount}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {likesCount}
            </motion.span>
          </button>

          {/* Comment button */}
          <button
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-400"
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            <HiOutlineChatAlt2 className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
            <span>{comments.length} responses</span>
          </button>
        </div>

        {/* Visibility badge */}
        <div className="flex items-center gap-4">
          <span
            className={`text-xs px-2.5 py-1 rounded-full capitalize ${
              post.visibility === "public"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
            }`}
          >
            {post.visibility || "public"}
          </span>

          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm rounded-lg transition-all duration-200 hover:shadow-sm active:scale-95 dark:bg-primary/20 dark:hover:bg-primary/30"
          >
            <HiOutlineCheckCircle className="w-5 h-5" />
            <span>Add Response</span>
          </button>
        </div>
      </div>

      {/* Comment form */}
      {showCommentForm && (
        <form
          onSubmit={handleCommentSubmit}
          className="mt-4 flex flex-col gap-2"
        >
          <textarea
            rows="3"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your response..."
            className="w-full p-3 border rounded-lg focus:outline-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCommentForm(false)}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 transition-colors dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-md active:scale-95 dark:hover:bg-primary/80"
            >
              Post Response
            </button>
          </div>
        </form>
      )}

      {/* Comments section */}
      <CommentsContainer comments={comments} />
    </article>
  );
};

export default ForumCard;
