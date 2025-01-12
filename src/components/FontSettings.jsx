import React, { useState, useEffect } from 'react';

const FontSettings = ({ onApply }) => {
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(14);
    const [fontWeight, setFontWeight] = useState('normal');
    const [fontColor, setFontColor] = useState('#000000');

    const handleApply = () => {
        onApply({ fontFamily, fontSize, fontWeight, fontColor });
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Font Settings</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Font Family</label>
                    <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
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
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Font Weight</label>
                    <select
                        value={fontWeight}
                        onChange={(e) => setFontWeight(e.target.value)}
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
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    />
                </div>
                <button
                    onClick={handleApply}
                    className="w-full p-2 bg-blue-500 text-white rounded-lg"
                >
                    Apply
                </button>
            </div>
        </div>
    );
};

export default FontSettings;
