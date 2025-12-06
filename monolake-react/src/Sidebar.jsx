import React from 'react';

const Sidebar = ({
  isOpen,
  onClose,
  onOpen,
  waterLevel,
  onWaterLevelChange,
  onShowCitations
}) => {

  const salinityValue = Math.round(81 * (0.19 + 0.1) / (waterLevel + 0.1));
  const birdPopValue = ((waterLevel / 0.1) * 3.2).toFixed(2);
  const brineShrimpPopValue = ((waterLevel / 0.19) * 5).toFixed(2);

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
            aria-label="Click to hide sidebar"
          >
            ⮜
          </button>

          {/* Sidebar Content */}
          <h3 className="text-lg font-semibold mb-4">Controls</h3>

          {/* Water Level */}
          <label className="flex flex-col space-y-2">
            <span>Water Level: {Math.round(6350 + (waterLevel / 0.6) * (100))} ft (Above Sea Level)</span>
            <input
              type="range"
              min={0.14}
              max={0.24}
              step={0.01}
              value={waterLevel}
              onChange={(e) => onWaterLevelChange(parseFloat(e.target.value))}
              aria-valuetext={`${Math.round(6350 + (waterLevel / 0.6) * (100))} feet`}
              aria-valuemin={6350}
              aria-valuemax={6450}
              aria-valuenow={waterLevel}
              className="w-full accent-blue-500"
            />
          </label>
          
          <div className="mt-4 mb-4 p-3 bg-gray-800 rounded-lg text-sm">

            {/* Salinity */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Salinity:</span>
              <span 
                className="font-mono font-bold"
                aria-label={`Calculated salinity: ${salinityValue} grams per liter`}
                role="definition"
              >
                {salinityValue} g/L
              </span>
            </div>

            {/* Bird Pop */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Bird Pop:</span>
              <span
                aria-label={`Calculated bird population: ${birdPopValue} million`}
                role="definition"
                className="font-mono font-bold">{((waterLevel / 0.1) * 3.2).toFixed(2)} Million</span>
            </div>

            {/* Shrimp Pop */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Brine Shrimp Pop:</span>
              <span
                aria-label={`Calculated brine shrimp population: ${brineShrimpPopValue} trillion`}
                role="definition"
                className="font-mono font-bold">{((waterLevel / 0.19) * 5).toFixed(2)} Trillion</span>
            </div>

            {/* Warning */}
            {waterLevel < 0.18 && (
              <p 
                className="text-yellow-400 text-xs mt-2 leading-relaxed border-t border-gray-700 pt-2"
                tabIndex="0"
              >
                ⚠️ When the water level drops below 6378 ft, severe impacts to the ecosystem will occur.
              </p>
            )}
          </div>

          
          <div className="flex justify-between items-center mb-2">
            <p>
              <small>
                <i>
                  All data and visuals are stylistic representations and should be treated as approximate estimates only
                </i>
              </small>
            </p>
          </div>
          <br></br>
          {/* Open Citations Modal */}
          <button
            onClick={onShowCitations}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded p-2 transition-colors duration-200"
          >
            View Model Attributions
          </button>
        </div>
      </div>

      {/* Floating Toggle Button (Visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="absolute top-4 left-4 bg-gray-800 text-white rounded p-2 shadow hover:bg-gray-700 transition-colors duration-200"
          aria-label="Click to show sidebar"
        >
          ⮞
        </button>
      )}
    </>
  );
};

export default Sidebar;