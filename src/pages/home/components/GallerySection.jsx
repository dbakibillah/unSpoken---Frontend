import React, { useState } from "react";

// Sample gallery data
const galleryData = [
  {
    id: 1,
    title: "Joyful Energy",
    author: "Alex",
    time: "2 hours ago",
    colors: ["#FFD93D", "#FF6B6B"], // optional for gradients
    tags: ["Joy", "Energy"],
    likes: 24,
    comments: 5,
    gradient: "from-yellow-300 to-red-400",
  },
  {
    id: 2,
    title: "Ocean Calm",
    author: "Maria",
    time: "1 day ago",
    colors: ["#4D96FF", "#9D65C9"],
    tags: ["Peace", "Depth"],
    likes: 42,
    comments: 12,
    gradient: "from-blue-400 to-purple-500",
  },
  {
    id: 3,
    title: "Growing Hope",
    author: "Sam",
    time: "3 days ago",
    colors: ["#6BCF7F", "#4D96FF"],
    tags: ["Growth", "Hope"],
    likes: 18,
    comments: 3,
    gradient: "from-green-400 to-blue-400",
  },
  {
    id: 4,
    title: "Mysterious Love",
    author: "Jamie",
    time: "1 week ago",
    colors: ["#9D65C9", "#EC4899"],
    tags: ["Mystery", "Love"],
    likes: 67,
    comments: 21,
    gradient: "from-purple-500 to-pink-500",
  },
];

const filterOptions = ["All", "Joy", "Sadness", "Love", "Calm", "Energy", "Recent", "Popular"];

const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  // Filter logic (simple demo)
  const filteredData =
    activeFilter === "All"
      ? galleryData
      : galleryData.filter((pattern) => pattern.tags.includes(activeFilter));

  return (
    <section id="gallery" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Pattern Gallery
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Explore emotional patterns from people around the world. Connect through shared feelings.
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeFilter === filter
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Patterns Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredData.map((pattern) => (
            <div
              key={pattern.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Gradient Preview */}
              <div
                className={`p-4 h-48 flex items-center justify-center bg-gradient-to-br ${pattern.gradient}`}
              >
                <div className="flex space-x-2">
                  {pattern.colors.map((color, i) => (
                    <div
                      key={i}
                      className={`rounded-full`}
                      style={{ width: 16 + i * 4, height: 16 + i * 4, backgroundColor: color, opacity: 0.4 }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Card Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1">{pattern.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  By {pattern.author} • {pattern.time}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {pattern.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded text-xs ${
                        tag === "Joy"
                          ? "bg-yellow-200 text-yellow-600"
                          : tag === "Energy"
                          ? "bg-red-200 text-red-600"
                          : tag === "Love"
                          ? "bg-pink-200 text-pink-600"
                          : tag === "Calm"
                          ? "bg-blue-200 text-blue-600"
                          : tag === "Growth"
                          ? "bg-green-200 text-green-600"
                          : tag === "Hope"
                          ? "bg-blue-200 text-blue-700"
                          : tag === "Mystery"
                          ? "bg-purple-200 text-purple-600"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-red-500">
                      ❤️ <span className="text-sm">{pattern.likes}</span>
                    </button>
                    <button className="text-gray-500 hover:text-primary">
                      💬 <span className="text-sm">{pattern.comments}</span>
                    </button>
                  </div>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    View Pattern
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
            Load More Patterns
          </button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
