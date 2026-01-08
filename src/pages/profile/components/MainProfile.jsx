import React from "react";

const MainProfile = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        {/* Cover Photo */}
        <div className="h-64 bg-gradient-to-r from-teal-500 via-teal-600 to-green-800 relative">
          <button className="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition">
            Edit Cover
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between -mt-16">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-40 h-40 bg-gradient-to-br from-teal-400 to-green-600 rounded-full border-8 border-white shadow-xl flex items-center justify-center text-7xl text-white font-bold">
                  A
                </div>
                <button className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition">
                  📷
                </button>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-800">Alex Morgan</h1>
                <p className="text-gray-600 text-lg mt-1">@visual_heart</p>
                <p className="text-gray-700 mt-4 max-w-2xl">
                  Expressing emotions through colors and patterns. Finding connections beyond words. 
                  Artist • Emotional Explorer • Silent Communicator
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm">#Calm</span>
                  <span className="px-3 py-1 bg-teal-50 text-teal-500 rounded-full text-sm">#Joyful</span>
                  <span className="px-3 py-1 bg-teal-200 text-teal-700 rounded-full text-sm">#Creative</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">#Passionate</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6 md:mt-0">
              <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium flex items-center transition">
                ✏️ Edit Profile
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition">
                Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-600">142</div>
            <div className="text-gray-600">Patterns Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-600">89</div>
            <div className="text-gray-600">Emotional Connections</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-600">247</div>
            <div className="text-gray-600">Reactions Received</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-600">156</div>
            <div className="text-gray-600">Days Active</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto scrollbar-hide">
                {["My Patterns","Activity","Collections","Liked Patterns","Emotion Timeline"].map((tab, idx) => (
                  <button
                    key={idx}
                    className={`tab-btn px-6 py-4 font-medium whitespace-nowrap ${
                      idx === 0 ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Patterns Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1,2,3].map((pattern) => (
                  <div key={pattern} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-teal-400 transition">
                    <div className={`h-48 relative rounded-t-lg ${
                      pattern === 1
                        ? "bg-gradient-to-br from-teal-400 to-green-600"
                        : pattern === 2
                        ? "bg-gradient-to-br from-teal-600 to-yellow-400"
                        : "bg-gradient-to-br from-green-400 to-teal-500"
                    }`}>
                      <span className="absolute top-3 right-3 px-2 py-1 bg-black/40 backdrop-blur-sm text-white text-xs rounded">{pattern === 2 ? "Private" : "Public"}</span>
                      <span className="absolute bottom-3 left-3 text-white font-medium">
                        {pattern === 1 ? "Ocean Dreams" : pattern === 2 ? "Passion Fire" : "Growth Journey"}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-500">{pattern === 1 ? "2 days ago" : pattern === 2 ? "1 week ago" : "2 weeks ago"}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-${pattern === 2 ? "red" : "teal"}-500`}>❤️</span>
                          <span className="text-sm">{pattern === 1 ? 24 : pattern === 2 ? 42 : 18}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-4">
                        {pattern === 1
                          ? "A calm day by the ocean, feeling the waves of peace..."
                          : pattern === 2
                          ? "Intense feelings of passion and energy..."
                          : "Growth and new beginnings..."}
                      </p>
                      <div className="flex justify-between">
                        <button className="text-teal-600 text-sm hover:text-teal-400 transition">View Details</button>
                        <button className="p-1 hover:bg-gray-100 rounded">⚡</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition">
                  Load More Patterns
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
            {[1,2,3].map((activity) => (
              <div key={activity} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  activity === 1 ? "bg-gradient-to-br from-purple-400 to-pink-500" : activity === 2 ? "bg-gradient-to-br from-teal-400 to-green-500" : "bg-gradient-to-br from-red-400 to-yellow-400"
                }`}>
                  {activity === 1 ? "J" : activity === 2 ? "T" : "S"}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-bold text-gray-800">
                      {activity === 1
                        ? "Jordan Lee connected with your pattern"
                        : activity === 2
                        ? "Taylor Chen liked your pattern"
                        : "New emotional match found!"}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {activity === 1 ? "2 hours ago" : activity === 2 ? "1 day ago" : "3 days ago"}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {activity === 1
                      ? `"Your 'Ocean Dreams' pattern really spoke to me."`
                      : activity === 2
                      ? `"Sunset Glow" received 12 new reactions including ❤️✨😊`
                      : `Sam's pattern "Mountain Peace" shares 92% emotional similarity with your "Forest Calm"`}
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <button className="px-3 py-1 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition">
                      {activity === 1 ? "Reply" : activity === 2 ? "Thank them" : "View Match"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* About Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Bio</h3>
                <p className="text-gray-600">
                  Digital artist and emotional explorer. Using colors and patterns to express what words cannot. 
                  Believer in silent connections and visual understanding.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Location</h3>
                <p className="text-gray-600">🌍 San Francisco, California</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Joined</h3>
                <p className="text-gray-600">📅 January 15, 2024 (156 days)</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Emotional Language</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm">Visual</span>
                  <span className="px-3 py-1 bg-teal-200 text-teal-700 rounded-full text-sm">Abstract</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Organic</span>
                  <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">Dynamic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emotional Insights */}
          <div className="bg-gradient-to-br from-teal-500 to-green-800 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Emotional Insights</h2>
            {[{label:"Calm",value:68},{label:"Joyful",value:42},{label:"Passionate",value:35},{label:"Reflective",value:57}].map((insight,idx)=>(
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span>{insight.label}</span>
                  <span>{insight.value}%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{width:`${insight.value}%`}}></div>
                </div>
              </div>
            ))}
            <button className="w-full mt-6 py-3 bg-white text-teal-600 rounded-xl font-medium hover:bg-gray-100 transition">
              View Full Analysis
            </button>
          </div>

          {/* Recent Connections */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Recent Connections</h2>
              <button className="text-teal-600 text-sm hover:text-teal-400 transition">View All</button>
            </div>
            {[1,2,3,4].map((conn)=>(
              <div key={conn} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    conn===1 ? "bg-gradient-to-br from-purple-400 to-pink-500" :
                    conn===2 ? "bg-gradient-to-br from-teal-400 to-green-500" :
                    conn===3 ? "bg-gradient-to-br from-red-400 to-yellow-400" :
                    "bg-gradient-to-br from-teal-500 to-cyan-400"
                  }`}>
                    {conn===1?"J":conn===2?"T":conn===3?"S":"M"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {conn===1?"Jordan Lee":conn===2?"Taylor Chen":conn===3?"Sam Rivera":"Morgan Kai"}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {conn===1?"3 shared emotions":conn===2?"5 pattern matches":conn===3?"92% emotional match":"Art therapist"}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm transition">
                  Message
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainProfile;
