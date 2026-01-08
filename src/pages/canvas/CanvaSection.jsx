import React, { useRef, useState, useEffect, useCallback, useContext } from "react";
import {
  FaUndo,
  FaRedo,
  FaEraser,
  FaSave,
  FaTrash,
  FaSpinner,
  FaPalette,
  FaEyeDropper,
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
  LuSliders,
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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [artworkData, setArtworkData] = useState({
    title: "",
    description: "",
    emotions: [],
    isPublic: true,
  });

  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  // Professional color palette
  const colorPalette = [
    "#FF6B6B", "#FF8E53", "#FFD166", "#06D6A0", "#118AB2", 
    "#073B4C", "#7209B7", "#F72585", "#4CC9F0", "#3A0CA3",
    "#FF595E", "#FFCA3A", "#8AC926", "#1982C4", "#6A4C93",
    "#000000", "#555555", "#AAAAAA", "#FFFFFF"
  ];

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
        colorsUsed: [currentColor],
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

  return (
    <section className="py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Digital Canvas
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Express your thoughts and emotions through digital art. Create, share, and save your visual expressions.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tools Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <LuMousePointer className="text-primary" />
                  Tools
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className={`p-2 rounded-lg ${showColorPicker ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-700'}`}
                    title="Color Picker"
                  >
                    <FaPalette className={showColorPicker ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    title="Settings"
                  >
                    <LuSliders />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                      tool === t.id
                        ? "bg-primary/10 border border-primary dark:bg-primary/20"
                        : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className={`text-xl mb-1 ${tool === t.id ? "text-primary" : "text-gray-600 dark:text-gray-300"}`}>
                      {t.icon}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker (when toggled) */}
            {showColorPicker && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 animate-fadeIn">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <FaEyeDropper className="text-primary" />
                  Color Palette
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-6 gap-2">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        onClick={() => setCurrentColor(color)}
                        className={`w-8 h-8 rounded-lg transition-transform ${currentColor === color ? 'ring-2 ring-offset-1 ring-primary scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t dark:border-gray-700">
                    <div
                      className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: currentColor }}
                    />
                    <div className="flex-1">
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => setCurrentColor(e.target.value)}
                        className="w-full h-8 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Brush Size */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                Brush Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span>Size</span>
                    <span>{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Fine</span>
                    <span>Bold</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2 pt-2">
                  {brushSizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setBrushSize(size.size)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                        brushSize === size.size
                          ? "bg-primary/10 border border-primary dark:bg-primary/20"
                          : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      <div
                        className="bg-gray-800 dark:bg-gray-200 rounded-full"
                        style={{ width: size.size, height: size.size }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {size.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* Canvas Header */}
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Undo (Ctrl+Z)"
                  >
                    <FaUndo />
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Redo (Ctrl+Y)"
                  >
                    <FaRedo />
                  </button>
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <button
                    onClick={clearCanvas}
                    className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Clear Canvas"
                  >
                    <FaTrash />
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: currentColor }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {currentColor}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSaveModal(true)}
                    disabled={!user}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    title={!user ? "Please login to save" : "Save Artwork"}
                  >
                    <FaSave />
                    Save
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div className="p-4">
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={600}
                  className="w-full h-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg cursor-crosshair"
                />
              </div>

              {/* Text Input (when text tool is selected) */}
              {tool === "text" && (
                <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Add text to your artwork..."
                      className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    >
                      <option value={16}>Small</option>
                      <option value={20}>Medium</option>
                      <option value={24}>Large</option>
                      <option value={32}>X-Large</option>
                    </select>
                    <button
                      onClick={addText}
                      className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Status Bar */}
              <div className="px-4 py-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                <div className="flex items-center gap-4">
                  <span>Tool: {tools.find(t => t.id === tool)?.label}</span>
                  <span>Brush: {brushSize}px</span>
                </div>
                <div>
                  <span>Canvas: 1200×600</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 p-5 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Quick Tips
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                  <span>Hold Shift for straight lines</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                  <span>Use larger brushes for bold strokes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                  <span>Right-click to pick colors from canvas</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                  <span>Double-click shapes to edit properties</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Save Artwork Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Save Artwork
              </h3>
              <button
                onClick={() => !isSaving && setShowSaveModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
                  placeholder="My Artwork"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                  placeholder="Describe your artwork..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  disabled={isSaving}
                />
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
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                    disabled={isSaving}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Make public
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => !isSaving && setShowSaveModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm disabled:opacity-50"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={saveArtworkToDatabase}
                  disabled={isSaving || !artworkData.title.trim()}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Artwork"
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