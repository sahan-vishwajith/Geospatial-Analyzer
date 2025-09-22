import React, { useState } from "react";
import { SatelliteIcon, TrashIcon } from "../icons/Icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Coordinate {
  lat: string;
  lon: string;
}

const TimeLapse: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [studyArea, setStudyArea] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinate[]>([{ lat: "", lon: "" }]);
  const [selectedIndex, setSelectedIndex] = useState(""); // NDVI, NDWI, etc.
  const [showResults, setShowResults] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const indices = ["NDVI", "NDWI", "EVI", "MNDWI"];

  // Example line chart data
  const chartData = [
    { time: "Year 1", value: 20 },
    { time: "Year 2", value: 35 },
    { time: "Year 3", value: 50 },
    { time: "Year 4", value: 45 },
    { time: "Year 5", value: 60 },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!studyArea || !startYear || !endYear || !coordinates.length || !selectedIndex) {
      setError("Please fill all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      // Convert coordinates to [lon, lat] pairs for backend
      const polygon = coordinates.map(c => [parseFloat(c.lon), parseFloat(c.lat)]);
      const res = await fetch("http://localhost:5000/api/analysis/perform-gee-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          polygon,
          analysisType: selectedIndex,
          startYear,
          endYear
        })
      });

      if (!res.ok) throw new Error("Server error during analysis");

      const data = await res.json();
      if (data.videoUrl) setVideoUrl(data.videoUrl);

      setIsLoading(false);
      setSubmitted(true);
      setShowResults(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setStudyArea("");
    setStartYear("");
    setEndYear("");
    setCoordinates([{ lat: "", lon: "" }]);
    setSelectedIndex("");
    setError(null);
    setIsLoading(false);
    setShowResults(false);
    setVideoUrl("");
  };

  const addCoordinate = () => setCoordinates([...coordinates, { lat: "", lon: "" }]);
  const updateCoordinate = (index: number, field: "lat" | "lon", value: string) => {
    const newCoords = [...coordinates];
    newCoords[index][field] = value;
    setCoordinates(newCoords);
  };
  const deleteCoordinate = (index: number) => setCoordinates(coordinates.filter((_, i) => i !== index));

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        {submitted ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-cyan-400">Time Lapse Analysis Complete!</h2>
            <p className="mt-2 text-gray-300">Your multi-year analysis has been processed successfully.</p>

            {/* Show video and chart */}
            {showResults && (
              <div className="mt-6 flex flex-col gap-6">
                <video
                  src={videoUrl || "/sample.mp4"}
                  controls
                  className="w-full rounded-xl shadow-md"
                />
                <div className="w-full h-64 bg-white rounded-xl p-4 shadow-md">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <button
              onClick={resetForm}
              className="mt-6 py-2 px-4 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition"
            >
              Run Another Analysis
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <SatelliteIcon className="w-12 h-12 text-cyan-400 mx-auto" />
              <h1 className="text-3xl font-bold text-white mt-2">Time Lapse Analysis</h1>
              <p className="mt-2 text-gray-400">Define study area, years, and indices for your timelapse analysis.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Study Area */}
              <div>
                <label htmlFor="studyArea" className="block text-sm font-medium text-gray-300">Study Area Name</label>
                <input
                  type="text"
                  id="studyArea"
                  value={studyArea}
                  onChange={(e) => setStudyArea(e.target.value)}
                  placeholder="Enter study area"
                  className="w-full mt-2 py-2 px-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Years */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startYear" className="block text-sm font-medium text-gray-300">Start Year</label>
                  <input
                    type="number"
                    id="startYear"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    placeholder="Enter start year"
                    className="w-full mt-2 py-2 px-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label htmlFor="endYear" className="block text-sm font-medium text-gray-300">End Year</label>
                  <input
                    type="number"
                    id="endYear"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    placeholder="Enter end year"
                    className="w-full mt-2 py-2 px-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Index Dropdown */}
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Select Index</label>
                  <select
                    value={selectedIndex}
                    onChange={(e) => setSelectedIndex(e.target.value)}
                    className="w-full py-2 px-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">--Select--</option>
                    {indices.map((index) => (
                      <option key={index} value={index}>{index}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIndex("")}
                  className="mt-6 py-2 px-4 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition"
                >
                  Reset
                </button>
              </div>

              {/* Coordinates */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Coordinates</label>
                <table className="w-full text-left text-gray-300 border border-gray-600 rounded-md">
                  <thead>
                    <tr>
                      <th className="px-2 py-1">Latitude</th>
                      <th className="px-2 py-1">Longitude</th>
                      <th className="px-2 py-1 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coordinates.map((coord, index) => (
                      <tr key={index}>
                        <td className="px-2 py-1">
                          <input
                            type="text"
                            value={coord.lat}
                            onChange={(e) => updateCoordinate(index, "lat", e.target.value)}
                            className="w-full px-1 py-1 bg-gray-700 border border-gray-600 rounded-md text-white"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="text"
                            value={coord.lon}
                            onChange={(e) => updateCoordinate(index, "lon", e.target.value)}
                            className="w-full px-1 py-1 bg-gray-700 border border-gray-600 rounded-md text-white"
                          />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <button
                            type="button"
                            onClick={() => deleteCoordinate(index)}
                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            <TrashIcon className="w-5 h-5 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  onClick={addCoordinate}
                  className="mt-2 px-3 py-1 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition font-medium"
                >
                  + Add Row
                </button>
              </div>

              {error && <p className="text-red-500">{error}</p>}

              {/* Submit and Reset Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Run Analysis"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                >
                  Reset
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default TimeLapse;
