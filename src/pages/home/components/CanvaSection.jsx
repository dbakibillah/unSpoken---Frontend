import React, { useRef, useState, useEffect } from "react";

const CanvaSection = () => {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("#FF6B6B");
  const [brushSize, setBrushSize] = useState(5);
  const [drawing, setDrawing] = useState(false);

  // Simple canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const startDrawing = (e) => {
      setDrawing(true);
      draw(e);
    };

    const stopDrawing = () => setDrawing(false);

    const draw = (e) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.arc(e.clientX - rect.left, e.clientY - rect.top, brushSize, 0, Math.PI * 2);
      ctx.fill();
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [drawing, brushSize, currentColor]);

  const colors = [
    { color: "#FF6B6B", label: "Passion" },
    { color: "#4D96FF", label: "Calm" },
    { color: "#FFD93D", label: "Joy" },
    { color: "#6BCF7F", label: "Peace" },
    { color: "#9D65C9", label: "Mystery" },
    { color: "#1F2937", label: "Depth" },
    { color: "#EC4899", label: "Love" },
    { color: "#F97316", label: "Energy" },
  ];

  const brushSizes = [2, 5, 10, 20];

  return (
    <section id="canvas" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Create Your Emotional Pattern
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Draw what you feel. Choose colors that match your emotions. Add shapes that represent your thoughts.
        </p>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-6">
            {/* Colors */}
            <div>
              <h4 className="font-medium mb-3 text-gray-700">Colors</h4>
              <div className="grid grid-cols-4 gap-3">
                {colors.map((c) => (
                  <div
                    key={c.color}
                    onClick={() => setCurrentColor(c.color)}
                    className={`w-10 h-10 rounded-lg cursor-pointer border-2 ${
                      currentColor === c.color ? "border-white shadow-lg" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                  ></div>
                ))}
              </div>
            </div>

            {/* Brush Size */}
            <div>
              <h4 className="font-medium mb-3 text-gray-700">Brush Size</h4>
              <div className="flex items-center space-x-4">
                {brushSizes.map((size) => (
                  <div
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={`w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer ${
                      brushSize === size ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div
                      className="bg-gray-800 rounded-full"
                      style={{ width: size, height: size }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  const ctx = canvasRef.current.getContext("2d");
                  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Clear Canvas
              </button>
              <button
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
              >
                Save Pattern
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="drawing-canvas w-full h-[500px] bg-white border-2 border-gray-200 rounded-lg"
              ></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CanvaSection;
