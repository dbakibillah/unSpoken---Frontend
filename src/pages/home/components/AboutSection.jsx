import React from "react";

const AboutSection = () => {
  const themes = [
    { id: 4, text: "Hidden voices sharing meaning in the dark" },
    { id: 5, text: "Feelings hiding inside visual patterns" },
    { id: 6, text: "Conversations from the heart, not the mouth" },
    { id: 10, text: "The wandering mind that holds meaning" },
  ];

  const steps = [
    {
      id: 1,
      title: "Draw Your Emotions",
      description: "Use colors and shapes to express what words cannot capture.",
    },
    {
      id: 2,
      title: "Tag Your Feelings",
      description: "Add emotional tags to help the system understand your pattern.",
    },
    {
      id: 3,
      title: "Find Connections",
      description: "Discover patterns from others that resonate with your emotions.",
    },
    {
      id: 4,
      title: "Connect Silently",
      description: "Build understanding without exchanging a single word.",
    },
  ];

  return (
    <section id="about" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          About Silent Pulse
        </h2>

        {/* Grid Layout */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Left Column */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-800">Our Vision</h3>
            <p className="text-gray-600 mb-6">
              Silent Pulse is born from the idea that true understanding often happens beyond words. 
              In a world where verbal communication can sometimes limit emotional expression, 
              we provide a canvas for the heart to speak through colors and shapes.
            </p>

            {/* Themes Box */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h4 className="font-bold mb-3 text-gray-800">The Four Themes</h4>
              <ul className="space-y-3 text-gray-600">
                {themes.map((theme) => (
                  <li key={theme.id} className="flex items-start">
                    <span className="text-primary mr-2 text-xl">•</span>
                    <span>
                      <strong>Theme {theme.id}:</strong> {theme.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-800">How It Works</h3>
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.id} className="flex items-start">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 shadow-sm">
                    <span className="text-primary font-bold">{step.id}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
