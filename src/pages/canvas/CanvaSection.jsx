import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import {
  FaUndo,
  FaRedo,
  FaEraser,
  FaSave,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import {
  LuBrush,
  LuMousePointer,
  LuType,
  LuMinus,
  LuCircle,
  LuSquare,
  LuTriangle,
  LuHexagon,
} from "react-icons/lu";
import { toast } from "react-toastify";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../providers/AuthProviders";

const CanvaSection = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("brush");
  const [currentColor, setCurrentColor] = useState("#FF6B6B");
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState(20);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [artworkData, setArtworkData] = useState({
    title: "",
    description: "",
    emotions: [],
    isPublic: true,
  });

  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setContext(ctx);

    // Set white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  }, []);

  // Save canvas state to history
  const saveToHistory = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png", 0.8);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo functionality
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyIndex - 1];
    }
  };

  // Redo functionality
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyIndex + 1];
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveToHistory();
  };

  // Start drawing
  const startDrawing = (e) => {
    if (!context) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });

    if (tool === "brush" || tool === "eraser") {
      context.beginPath();
      context.moveTo(x, y);
    }

    setDrawing(true);
  };

  // Draw function
  const draw = (e) => {
    if (!drawing || !context) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === "brush") {
      context.strokeStyle = currentColor;
      context.lineWidth = brushSize;
      context.lineTo(x, y);
      context.stroke();
    } else if (tool === "eraser") {
      context.strokeStyle = "#FFFFFF";
      context.lineWidth = brushSize * 2;
      context.lineTo(x, y);
      context.stroke();
    }
  };

  // Stop drawing
  const stopDrawing = (e) => {
    if (!drawing || !context) return;

    if (tool === "brush" || tool === "eraser") {
      context.closePath();
    } else if (tool === "rectangle") {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = x - startPos.x;
      const height = y - startPos.y;

      context.beginPath();
      context.strokeStyle = currentColor;
      context.lineWidth = brushSize;
      context.strokeRect(startPos.x, startPos.y, width, height);
    } else if (tool === "circle") {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const radius = Math.sqrt(
        Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
      );

      context.beginPath();
      context.strokeStyle = currentColor;
      context.lineWidth = brushSize;
      context.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
      context.stroke();
    } else if (tool === "triangle") {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      context.beginPath();
      context.strokeStyle = currentColor;
      context.lineWidth = brushSize;
      context.moveTo(startPos.x, startPos.y);
      context.lineTo(x, y);
      context.lineTo(startPos.x * 2 - x, y);
      context.closePath();
      context.stroke();
    }

    setDrawing(false);
    saveToHistory();
  };

  // Add text to canvas
  const addText = () => {
    if (!context || !textInput.trim()) return;

    const canvas = canvasRef.current;
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    context.font = `${fontSize}px Arial`;
    context.fillStyle = currentColor;
    context.textAlign = "center";
    context.fillText(textInput, x, y);

    setTextInput("");
    saveToHistory();
  };

  // Get current emotion from selected color
  const getCurrentEmotion = () => {
    return (
      emotionColors.find((c) => c.color === currentColor)?.name || "Custom"
    );
  };

  // Handle emotion selection in save form
  const handleEmotionToggle = (emotionName) => {
    setArtworkData((prev) => {
      const emotions = prev.emotions.includes(emotionName)
        ? prev.emotions.filter((e) => e !== emotionName)
        : [...prev.emotions, emotionName];
      return { ...prev, emotions };
    });
  };

  // Save artwork to database
  const saveArtworkToDatabase = async () => {
    if (!user) {
      toast.error("Please login to save your artwork");
      return;
    }

    if (!artworkData.title.trim()) {
      toast.error("Please give your artwork a title");
      return;
    }

    setIsSaving(true);

    try {
      // Get canvas as base64 image
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL("image/png", 0.8);

      // Prepare artwork data
      const artwork = {
        title: artworkData.title,
        description: artworkData.description,
        imageData: imageData,
        emotions: artworkData.emotions,
        colorsUsed: emotionColors
          .filter((color) =>
            canvasData.includes(color.color.toLowerCase().replace("#", ""))
          )
          .map((color) => color.name),
        toolsUsed: [tool],
        brushSizes: [brushSize],
        isPublic: artworkData.isPublic,
        user: {
          name: user.displayName || user.name || "Anonymous",
          email: user.email,
          photo: user.photoURL || "",
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        views: 0,
      };

      // Save to database
      const response = await axiosPublic.post("/artworks/save", artwork);

      if (response.data.success) {
        toast.success("Artwork saved successfully!");
        setShowSaveModal(false);
        setArtworkData({
          title: "",
          description: "",
          emotions: [],
          isPublic: true,
        });
      } else {
        throw new Error(response.data.message || "Failed to save artwork");
      }
    } catch (error) {
      console.error("Error saving artwork:", error);
      toast.error(error.message || "Failed to save artwork. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Emotion colors with names
  const emotionColors = [
    { color: "#FF6B6B", name: "Anger", emoji: "😠", label: "Passionate Red" },
    { color: "#4D96FF", name: "Sadness", emoji: "😔", label: "Calm Blue" },
    { color: "#FFD93D", name: "Joy", emoji: "😊", label: "Sunny Yellow" },
    { color: "#6BCF7F", name: "Peace", emoji: "😌", label: "Peaceful Green" },
    { color: "#9D65C9", name: "Mystery", emoji: "🔮", label: "Mystic Purple" },
    { color: "#1F2937", name: "Depth", emoji: "🌌", label: "Deep Gray" },
    { color: "#EC4899", name: "Love", emoji: "❤️", label: "Loving Pink" },
    {
      color: "#F97316",
      name: "Energy",
      emoji: "⚡",
      label: "Energetic Orange",
    },
    { color: "#06B6D4", name: "Clarity", emoji: "💎", label: "Clear Cyan" },
    { color: "#10B981", name: "Growth", emoji: "🌱", label: "Growing Emerald" },
  ];

  // Tools with icons
  const tools = [
    { id: "brush", icon: <LuBrush />, label: "Brush" },
    { id: "eraser", icon: <FaEraser />, label: "Eraser" },
    { id: "line", icon: <LuMinus />, label: "Line" },
    { id: "rectangle", icon: <LuSquare />, label: "Rectangle" },
    { id: "circle", icon: <LuCircle />, label: "Circle" },
    { id: "triangle", icon: <LuTriangle />, label: "Triangle" },
    { id: "hexagon", icon: <LuHexagon />, label: "Hexagon" },
    { id: "text", icon: <LuType />, label: "Text" },
  ];

  // Brush sizes
  const brushSizes = [
    { size: 2, label: "Fine" },
    { size: 5, label: "Thin" },
    { size: 10, label: "Medium" },
    { size: 20, label: "Thick" },
    { size: 30, label: "Bold" },
  ];

  // Mouse event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e) => startDrawing(e);
    const handleMouseUp = (e) => stopDrawing(e);
    const handleMouseMove = (e) => draw(e);
    const handleMouseLeave = () => setDrawing(false);

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [drawing, tool, context, currentColor, brushSize]);

  // Get canvas data for color analysis
  const [canvasData, setCanvasData] = useState("");
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setCanvasData(imageData.data.toString());
  }, [historyIndex]);

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Emotional Canvas
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Express your feelings through colors and shapes. Create visual
            patterns that represent your emotional state.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tools Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <LuMousePointer className="text-primary" />
                Tools
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {tools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                      tool === t.id
                        ? "bg-primary/10 border-2 border-primary dark:bg-primary/20"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`text-2xl mb-1 ${
                        tool === t.id
                          ? "text-primary"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {t.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Emotions Palette
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {emotionColors.map((color) => (
                  <button
                    key={color.color}
                    onClick={() => setCurrentColor(color.color)}
                    className={`p-3 rounded-xl text-left transition-all duration-200 ${
                      currentColor === color.color
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.color + "20" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg shadow-md"
                        style={{ backgroundColor: color.color }}
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{color.emoji}</span>
                          <span className="font-semibold text-gray-800 dark:text-white">
                            {color.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {color.label}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Brush Size */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Brush Size
              </h3>
              <div className="space-y-4">
                {brushSizes.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => setBrushSize(size.size)}
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${
                      brushSize === size.size
                        ? "bg-primary/10 border-2 border-primary dark:bg-primary/20"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {size.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="bg-gray-800 dark:bg-gray-200 rounded-full"
                        style={{ width: size.size, height: size.size }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {size.size}px
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2">
              {/* Canvas Header */}
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Undo"
                  >
                    <FaUndo />
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Redo"
                  >
                    <FaRedo />
                  </button>
                  <button
                    onClick={clearCanvas}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                    title="Clear Canvas"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md shadow"
                      style={{ backgroundColor: currentColor }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current: {getCurrentEmotion()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Brush: {brushSize}px
                  </span>
                </div>
              </div>

              {/* Canvas */}
              <div className="p-4">
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={600}
                  className="w-full h-[600px] bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg cursor-crosshair"
                />
              </div>

              {/* Text Input (when text tool is selected) */}
              {tool === "text" && (
                <div className="p-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Type your emotions..."
                      className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value={16}>Small</option>
                      <option value={20}>Medium</option>
                      <option value={24}>Large</option>
                      <option value={32}>X-Large</option>
                    </select>
                    <button
                      onClick={addText}
                      className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                    >
                      Add Text
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-4 border-t dark:border-gray-700 flex justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={clearCanvas}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
                  >
                    <FaTrash />
                    Clear All
                  </button>
                  <button
                    onClick={() => setTool("eraser")}
                    className={`px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 ${
                      tool === "eraser"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <FaEraser />
                    Eraser
                  </button>
                </div>
                <button
                  onClick={() => setShowSaveModal(true)}
                  disabled={!user}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!user ? "Please login to save" : "Save to database"}
                >
                  <FaSave />
                  Save Artwork
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                How to Express Yourself:
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Use different colors for different emotions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Draw shapes to represent thoughts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Larger brush = stronger feelings
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Add text to label your emotions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Save Artwork Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                Save Your Artwork
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                disabled={isSaving}
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Title *
                </label>
                <input
                  type="text"
                  value={artworkData.title}
                  onChange={(e) =>
                    setArtworkData({ ...artworkData, title: e.target.value })
                  }
                  placeholder="Give your artwork a meaningful title"
                  className="w-full px-4 py-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={artworkData.description}
                  onChange={(e) =>
                    setArtworkData({
                      ...artworkData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe what emotions you expressed and why..."
                  rows={3}
                  className="w-full px-4 py-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Emotions Expressed
                </label>
                <div className="flex flex-wrap gap-2">
                  {emotionColors.map((emotion) => (
                    <button
                      key={emotion.name}
                      type="button"
                      onClick={() => handleEmotionToggle(emotion.name)}
                      className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        artworkData.emotions.includes(emotion.name)
                          ? "bg-primary/20 border-2 border-primary"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      disabled={isSaving}
                    >
                      <span>{emotion.emoji}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {emotion.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={artworkData.isPublic}
                    onChange={(e) =>
                      setArtworkData({
                        ...artworkData,
                        isPublic: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                    disabled={isSaving}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Make this artwork public (others can view it)
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={saveArtworkToDatabase}
                  disabled={isSaving || !artworkData.title.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save to Gallery"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CanvaSection;
