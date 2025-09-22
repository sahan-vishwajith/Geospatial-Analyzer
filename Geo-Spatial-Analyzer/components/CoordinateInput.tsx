// src/components/CoordinateInput.tsx - Complete version that only allows numerical input

import React from 'react';
import { BoundaryPoint } from '../types';
import { MapPinIcon, PlusIcon, TrashIcon } from './icons/Icons';

interface CoordinateInputProps {
  boundaryPoints: BoundaryPoint[];
  onBoundaryPointsChange: (points: BoundaryPoint[]) => void;
  isStreaming: boolean;
}

const CoordinateInput: React.FC<CoordinateInputProps> = ({ boundaryPoints, onBoundaryPointsChange, isStreaming }) => {

  // This function is called every time you type in an input box.
  // It checks if the new value is a valid number before updating the state.
  const handlePointChange = (id: number, field: 'x' | 'y' | 'z', value: string) => {
    // This regular expression allows an empty string, an optional negative sign,
    // any number of digits, an optional single decimal point, and more digits.
    // It blocks any letters or other characters.
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      const newPoints = boundaryPoints.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      );
      onBoundaryPointsChange(newPoints);
    }
  };

  const addPoint = () => {
    // Creates a new point with a unique ID
    const newId = boundaryPoints.length > 0 ? Math.max(...boundaryPoints.map(p => p.id)) + 1 : 1;
    onBoundaryPointsChange([...boundaryPoints, { id: newId, x: '', y: '', z: '' }]);
  };

  const removePoint = (id: number) => {
    // Prevents removing the very last point
    if (boundaryPoints.length <= 1) return;
    onBoundaryPointsChange(boundaryPoints.filter(p => p.id !== id));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <MapPinIcon className="w-6 h-6 mr-3 text-cyan-400" />
        Define Study Area Boundary
      </h3>
      <p className="text-sm text-gray-400 mb-4">Enter the Longitude (X) and Latitude (Y) coordinates that define your study area polygon.</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-cyan-400 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-4 py-3">Point #</th>
              <th scope="col" className="px-4 py-3">X Coordinate (Longitude)</th>
              <th scope="col" className="px-4 py-3">Y Coordinate (Latitude)</th>
              <th scope="col" className="px-4 py-3">Z Coordinate (Optional)</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {boundaryPoints.map((point, index) => (
              <tr key={point.id} className="border-b border-gray-700">
                <td className="px-4 py-2 font-medium text-white">{index + 1}</td>
                <td className="px-2 py-2">
                  <input type="text" value={point.x} onChange={(e) => handlePointChange(point.id, 'x', e.target.value)} disabled={isStreaming} placeholder="e.g., 79.802" className="w-full rounded-md border-0 bg-gray-700/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm"/>
                </td>
                <td className="px-2 py-2">
                  <input type="text" value={point.y} onChange={(e) => handlePointChange(point.id, 'y', e.target.value)} disabled={isStreaming} placeholder="e.g., 8.163" className="w-full rounded-md border-0 bg-gray-700/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm"/>
                </td>
                <td className="px-2 py-2">
                  <input type="text" value={point.z} onChange={(e) => handlePointChange(point.id, 'z', e.target.value)} disabled={isStreaming} placeholder="e.g., 142.75" className="w-full rounded-md border-0 bg-gray-700/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm"/>
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => removePoint(point.id)} disabled={isStreaming || boundaryPoints.length <= 1} className="text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button onClick={addPoint} disabled={isStreaming} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 transition duration-300">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Point
        </button>
      </div>

    </div>
  );
};

export default CoordinateInput;