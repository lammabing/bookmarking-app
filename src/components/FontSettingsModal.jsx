import React, { useState } from 'react';

const FontSettingsModal = ({ isOpen, onClose, onApply, initialSettings }) => {
  const [fontSettings, setFontSettings] = useState(initialSettings);

  const handleApply = () => {
    onApply(fontSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
          <h2 className="text-xl font-bold mb-4">Font Settings</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Title</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Font Family</label>
                  <select
                      value={fontSettings.titleFontFamily}
                      onChange={(e) =>
                          setFontSettings({...fontSettings, titleFontFamily: e.target.value})
                      }
                      className="w-full p-2 border rounded-lg"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font Size (px)</label>
                  <input
                      type="number"
                      value={fontSettings.titleFontSize}
                      onChange={(e) =>
                          setFontSettings({...fontSettings, titleFontSize: Number(e.target.value)})
                      }
                      className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font Weight</label>
                  <select
                      value={fontSettings.titleFontWeight}
                      onChange={(e) =>
                          setFontSettings({...fontSettings, titleFontWeight: e.target.value})
                      }
                      className="w-full p-2 border rounded-lg"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font Color</label>
                  <input
                      type="color"
                      value={fontSettings.titleFontColor}
                      onChange={(e) =>
                          setFontSettings({...fontSettings, titleFontColor: e.target.value})
                      }
                      className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Font Family</label>
                  <select
                      value={fontSettings.descriptionFontFamily}
                      onChange={(e) =>
                          setFontSettings({...fontSettings, descriptionFontFamily: e.target.value})
                      }
                      className="w-full p-2 border rounded-lg"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font Size (px)</label>
                  <input
                      type="number"
                      value={fontSettings.descriptionFontSize}
                      onChange={(e) =>
                          setFontSettings({...fontSettings, descriptionFontSize: Number(e.target.value)})
                      }
                      className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font Weight</label>
                  <select
                      value={fontSettings.descriptionFontWeight}
                      onChange={(e) =>
                          setFontSettings({...fontSettings, descriptionFontWeight: e.target.value})
                      }
                      className="w-full p-2 border rounded-lg"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font Color</label>
                  <input
                      type="color"
                      value={fontSettings.descriptionFontColor}
                      onChange={(e) =>
                          setFontSettings({...fontSettings, descriptionFontColor: e.target.value})
                      }
                      className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                  onClick={handleApply}
                  className="w-full p-2 bg-blue-500 text-white rounded-lg"
              >
                Apply
              </button>
              <button
                  onClick={onClose}
                  className="w-full p-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FontSettingsModal;
