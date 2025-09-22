import React, { useState, useRef } from "react";
import { SatelliteIcon, TrashIcon } from "../icons/Icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Coordinate {
  lat: string;
  lon: string;
}

const AnalysisView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [studyArea, setStudyArea] = useState("");
  const [year, setYear] = useState("");
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null, null]); // B2-B6
  const [coordinates, setCoordinates] = useState<Coordinate[]>([{ lat: "", lon: "" }]);
  const [selectedIndex, setSelectedIndex] = useState(""); // NDVI, NDWI, etc.

  const bandNames = ["B2 (Blue)", "B3 (Green)", "B4 (Red)", "B5 (NIR)", "B6 (SWIR1)"];
  const indices = ["NDVI", "NDWI", "EVI", "MNDWI"];

  const reportRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (index: number, file: File | null) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!studyArea || !year || files.some(f => !f)) {
      setError("Please fill all fields and upload all bands (B2-B6).");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("indexType", selectedIndex);
      formData.append("year", year);
      formData.append("studyArea", studyArea);
      files.forEach(f => formData.append("bands", f!));
      coordinates.forEach((c, i) => {
        formData.append(`coordinates[${i}][lat]`, c.lat);
        formData.append(`coordinates[${i}][lon]`, c.lon);
      });

      const res = await fetch("http://localhost:5000/upload-bands-analysis", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Server error during analysis");

      const data = await res.json();
      console.log(data); // handle statistics, result image, etc. as needed

      setIsLoading(false);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setStudyArea("");
    setYear("");
    setFiles([null, null, null, null, null]);
    setCoordinates([{ lat: "", lon: "" }]);
    setSelectedIndex("");
    setError(null);
    setIsLoading(false);
  };

  const addCoordinate = () => setCoordinates([...coordinates, { lat: "", lon: "" }]);
  const updateCoordinate = (index: number, field: "lat" | "lon", value: string) => {
    const newCoords = [...coordinates];
    newCoords[index][field] = value;
    setCoordinates(newCoords);
  };
  const deleteCoordinate = (index: number) => setCoordinates(coordinates.filter((_, i) => i !== index));

  const downloadPDF = () => {
    if (!reportRef.current) return;
    html2canvas(reportRef.current).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Analysis_Report.pdf");
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        {submitted ? (
          <div>
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-cyan-400">Analysis Complete!</h2>
              <p className="mt-2 text-gray-300">Your analysis has been processed successfully.</p>
            </div>

            <div ref={reportRef} className="bg-gray-900 p-4 rounded-md mt-4">
              <h3 className="text-xl font-semibold text-white mb-2">Analyzed Map</h3>
              <div className="bg-gray-700 h-64 w-full flex items-center justify-center text-gray-300">
                [Analyzed Map Placeholder]
              </div>
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">Statistics</h3>
              <table className="w-full text-left text-gray-300 border border-gray-600 rounded-md">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Coordinate</th>
                    <th className="px-2 py-1">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {coordinates.map((coord, index) => (
                    <tr key={index}>
                      <td className="px-2 py-1">{`${coord.lat}, ${coord.lon}`}</td>
                      <td className="px-2 py-1">[Statistic Value]</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={downloadPDF}
                className="py-2 px-4 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition"
              >
                Download Report as PDF
              </button>
              <button
                onClick={resetForm}
                className="py-2 px-4 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition"
              >
                Run Another Analysis
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <SatelliteIcon className="w-12 h-12 text-cyan-400 mx-auto" />
              <h1 className="text-3xl font-bold text-white mt-2">Raster Band Analysis</h1>
              <p className="mt-2 text-gray-400">Upload your bands and define your study area for analysis.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
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
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-300">Year</label>
                <input
                  type="number"
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Enter year"
                  className="w-full mt-2 py-2 px-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Bands (B2-B6)</label>
                {bandNames.map((band, index) => (
                  <div key={index} className="mt-2 relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                      className="w-full py-2 pl-24 pr-3 text-white bg-gray-700 border border-gray-600 rounded-md file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{band}</span>
                  </div>
                ))}
              </div>
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

export default AnalysisView;
