import React from "react";

const FindMatch = () => {
  const userPattern = {
    title: "Passionate Energy",
    created: "Created just now",
    colors: ["#FF6B6B", "#FFD93D", "#FF6B6B80"], // red, yellow, semi-transparent red
    tags: ["Passion", "Energy"],
  };

  const matchingPattern = {
    title: "Fiery Joy",
    author: "Taylor",
    time: "5 hours ago",
    matchPercentage: 89,
    colors: ["#FF6B6B", "#FFD93D80", "#FF6B6B99"], // gradient effect
    tags: ["Fire", "Joy"],
  };

  const renderPatternPreview = (colors) => (
    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center mb-6">
      <div className="flex space-x-3">
        {colors.map((color, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: 12 + i * 4,
              height: 12 + i * 4,
              backgroundColor: color,
            }}
          ></div>
        ))}
      </div>
    </div>
  );

  const renderTags = (tags, colorMapping) => (
    <div className="flex justify-center space-x-2 mb-4">
      {tags.map((tag, i) => (
        <span
          key={i}
          className={`px-3 py-1 rounded-full text-sm`}
          style={{
            backgroundColor: colorMapping[tag]?.bg || "#F3F4F6",
            color: colorMapping[tag]?.text || "#1F2937",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );

  const tagColors = {
    Passion: { bg: "rgba(255,107,107,0.2)", text: "#FF6B6B" },
    Energy: { bg: "rgba(255,217,61,0.2)", text: "#FFD93D" },
    Fire: { bg: "rgba(255,107,107,0.2)", text: "#FF6B6B" },
    Joy: { bg: "rgba(255,217,61,0.2)", text: "#FFD93D" },
  };

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-primary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Find Your Emotional Match
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Discover patterns that resonate with your feelings. Connect with others
          who understand without words.
        </p>

        {/* Match Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* User Pattern */}
            <div className="md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Your Pattern</h3>
              {renderPatternPreview(userPattern.colors)}
              <div className="text-center">
                <h4 className="font-bold text-gray-800 mb-2">{userPattern.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{userPattern.created}</p>
                {renderTags(userPattern.tags, tagColors)}
              </div>
            </div>

            {/* Matching Pattern */}
            <div className="md:w-1/2 p-8">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Matching Pattern</h3>
              {renderPatternPreview(matchingPattern.colors)}
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium mb-3">
                  ⚡ {matchingPattern.matchPercentage}% Match
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{matchingPattern.title}</h4>
                <p className="text-gray-600 text-sm mb-4">
                  By {matchingPattern.author} • {matchingPattern.time}
                </p>
                {renderTags(matchingPattern.tags, tagColors)}
                <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">
                  Connect with Creator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindMatch;
