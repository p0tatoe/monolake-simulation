import React from 'react';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  onOpen,
  waterLevel, 
  onWaterLevelChange 
}) => {
  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className={`absolute top-0 left-0 h-full bg-gray-900 text-white shadow-xl transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: "16rem" }}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Toggle Button Inside Sidebar */}
          <button
            onClick={onClose}
            className="self-end bg-gray-700 hover:bg-gray-600 rounded p-2 mb-4 transition-colors duration-200"
          >
            ⮜
          </button>
          
          {/* Sidebar Content */}
          <h3 className="text-lg font-semibold mb-4">Controls</h3>
          <label className="flex flex-col space-y-2">
            <span>Water Level: {Math.round(6239 + (waterLevel / 0.3) * (6500 - 6239))} ft (Above Sea Level)</span>
            <input
              type="range"
              min={0}
              max={0.3}
              step={0.01}
              value={waterLevel}
              onChange={(e) => onWaterLevelChange(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </label>
        </div>
      </div>
      
      {/* Floating Toggle Button (Visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="absolute top-4 left-4 bg-gray-800 text-white rounded p-2 shadow hover:bg-gray-700 transition-colors duration-200"
        >
          ⮞
        </button>
      )}
    </>
  );
};

export default Sidebar;