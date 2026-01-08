import { useQuery } from "@tanstack/react-query";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import CreateThreads from "./components/CreateThreads";
import ForumCard from "./components/ForumCard";
import RightSideBar from "./components/RightSideBar";

const Community = () => {
  const axiosPublic = useAxiosPublic();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL params
  const initialCategory = searchParams.get("category") || null;
  const initialTags = searchParams.get("tags")
    ? searchParams.get("tags").split(",")
    : [];

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState(initialTags);

  // Scroll to top only on initial load
  const [hasInitialScroll, setHasInitialScroll] = useState(false);
  useEffect(() => {
    if (!hasInitialScroll) {
      window.scrollTo(0, 0);
      setHasInitialScroll(true);
    }
  }, [hasInitialScroll]);

  const { data: posts = [], refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await axiosPublic.get("/forums/all");
      return response.data;
    },
  });

  console.log(posts);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
      mirror: true,
    });
  }, []);

  // Sync URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    }

    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedTags, setSearchParams]);

  const handleCategorySelect = (category) => {
    if (category === selectedCategory) {
      setSelectedCategory(null); // Toggle off if same category clicked
    } else {
      setSelectedCategory(category);
    }
  };

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredPosts = posts.filter((post) => {
    // If posts don't have category/tags, handle gracefully
    const postCategory =
      post.category || post.emotion?.currentMood || "Uncategorized";
    const postTags = post.tags || [];

    // Category filter
    const categoryMatch =
      !selectedCategory || postCategory === selectedCategory;

    // Tag filter - check if any selected tag exists in post tags
    const tagMatch =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => postTags.includes(tag));

    return categoryMatch && tagMatch;
  });

  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Extract unique categories from posts for filtering
  const categories = [
    ...new Set(
      posts.map(
        (post) => post.category || post.emotion?.currentMood || "Uncategorized"
      )
    ),
  ];

  // Extract all tags from posts
  const allTags = [...new Set(posts.flatMap((post) => post.tags || []))];

  return (
    <section className="container mx-auto py-8 flex flex-col md:flex-row gap-6 max-w-7xl">
      {/* Main Content */}
      <main className="flex-1">
        <div>
          <CreateThreads refetch={refetch} />
        </div>

        <div className="bg-white rounded-lg p-2 dark:bg-gray-900">
          {/* Filter indicators */}
          {(selectedCategory || selectedTags.length > 0) && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-blue-800 dark:text-blue-200">
                  Showing threads:
                </span>
                {selectedCategory && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full flex items-center gap-1">
                    {selectedCategory}
                    <button
                      onClick={() => handleCategorySelect(null)}
                      className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      onClick={() => handleTagSelect(tag)}
                      className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(selectedCategory || selectedTags.length > 0) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedTags([]);
                    }}
                    className="ml-2 text-sm text-blue-600 dark:text-blue-300 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick filter buttons */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm self-center">
              Filter by mood:
            </span>
            {categories.slice(0, 5).map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Threads list */}
          <div className="">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post, index) => (
                <div key={post._id} className="transition-colors duration-200">
                  <ForumCard post={post} refetch={refetch} />
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {posts.length === 0
                    ? "No threads yet. Be the first to post!"
                    : "No threads match your filters. Try changing them."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <div className="hidden md:block sticky top-20 h-[calc(100vh-4rem)]">
        <RightSideBar
          posts={posts}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          allTags={allTags}
        />
      </div>
    </section>
  );
};

export default Community;
