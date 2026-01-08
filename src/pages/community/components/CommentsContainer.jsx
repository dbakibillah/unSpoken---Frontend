import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineUserCircle,
} from "react-icons/hi";

const CommentsContainer = ({ comments }) => {
  const [visibleCount, setVisibleCount] = useState(3);

  if (!comments || comments.length === 0) return null;

  const displayedComments = comments.slice(0, visibleCount);
  const hasMoreComments = comments.length > visibleCount;

  return (
    <section>
      <div className="mt-6 border-t-2 pt-4 space-y-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Responses ({comments.length})
          </h3>
        </div>

        <div className="space-y-4">
          {displayedComments.map((cmt, idx) => {
            // Handle different comment structures
            const userName = cmt.user?.name || cmt.userName || "Anonymous";
            const userPhoto = cmt.user?.photo || cmt.userImg;
            const commentText = cmt.text || cmt.comment || "";

            // Try to get timestamp from multiple possible fields
            const timeStamp = cmt.createdAt || cmt.time || cmt.timestamp;

            return (
              <div key={cmt.commentId || idx} className="flex gap-3">
                <div className="flex-shrink-0 pt-1">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML =
                          '<HiOutlineUserCircle className="w-8 h-8 text-gray-400" />';
                      }}
                    />
                  ) : (
                    <HiOutlineUserCircle className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-xl p-3 dark:bg-gray-800/50">
                    <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                        {userName}
                      </p>
                      {timeStamp && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(timeStamp), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {commentText}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hasMoreComments && (
          <div className="text-center pt-2">
            <button
              onClick={() => setVisibleCount(comments.length)}
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors dark:text-primary-400 dark:hover:text-primary-300"
            >
              <HiOutlineChevronDown className="h-4 w-4" />
              Show {comments.length - visibleCount} more responses
            </button>
          </div>
        )}

        {visibleCount > 3 && hasMoreComments && (
          <div className="text-center pt-2">
            <button
              onClick={() => setVisibleCount(3)}
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors dark:text-primary-400 dark:hover:text-primary-300"
            >
              <HiOutlineChevronUp className="h-4 w-4" />
              Show less
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentsContainer;
