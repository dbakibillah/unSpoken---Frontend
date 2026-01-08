import React from "react";

const Hero = () => {
  return (
    <section id="home" className="pt-20 pb-16 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
      <div className="container mx-auto px-4">
        {/* Hero Text */}
        <div className="max-w-4xl mx-auto text-center text-white py-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Speak Without Words
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Share emotions through colors and shapes. Connect hearts without saying a single word.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300 text-lg shadow-lg">
              Start Drawing
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 hover:scale-105 transition-transform duration-300 text-lg">
              Explore Gallery
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
          {/* Card 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4 text-3xl">
              🎨
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Visual Language</h3>
            <p className="text-white/80">
              Express emotions through colors, shapes, and patterns instead of words.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4 text-3xl">
              💞
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Emotional Connection</h3>
            <p className="text-white/80">
              Find others who understand your feelings through pattern matching.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4 text-3xl">
              🔒
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Silent Communication</h3>
            <p className="text-white/80">
              Share deep feelings that words can't capture in a safe, anonymous space.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
