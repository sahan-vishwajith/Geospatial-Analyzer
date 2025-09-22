// src/components/views/AboutView.tsx

import React from 'react';

const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-gray-300">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">

        <h1 className="text-4xl font-bold text-cyan-400 mb-4">About the Geo-Spatial Analyzer</h1>

        <p className="text-lg mb-6">
          This platform is a powerful tool designed for the monitoring and analysis of environmental change using cutting-edge satellite imagery and cloud-based geospatial processing.
        </p>

        <div className="border-t border-gray-700 my-6"></div>

        <h2 className="text-2xl font-semibold text-white mb-3">Core Technology</h2>
        <p className="mb-4">
          Our analysis engine is powered by the **Google Earth Engine (GEE)** Python API. GEE provides access to a multi-petabyte catalog of satellite imagery and planetary-scale analysis capabilities. Instead of downloading and processing massive images locally, our system sends your analysis requests to Google's supercomputers, delivering results with unparalleled speed and scale.
        </p>

        <h2 className="text-2xl font-semibold text-white mb-3">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            <strong className="text-cyan-400">Multi-Year Change Detection:</strong> Analyze any user-defined area on Earth by comparing satellite data from different years.
          </li>
          <li>
            <strong className="text-cyan-400">Standardized Indices:</strong> Calculate critical environmental indices like NDVI (Normalized Difference Vegetation Index) to measure vegetation health and NDWI (Normalized Difference Water Index) to identify water bodies.
          </li>
          <li>
            <strong className="text-cyan-400">Intelligent Satellite Selection:</strong> The system automatically chooses the best satellite for the requested year, seamlessly switching between Landsat (for older data) and Sentinel-2 (for modern, high-resolution data).
          </li>
          <li>
            <strong className="text-cyan-400">Interactive Map Visualization:</strong> View your results as colored NDVI/NDWI maps overlaid on a familiar base map, allowing for clear visual interpretation.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mb-3">Our Mission</h2>
        <p>
          Our goal is to democratize access to powerful remote sensing tools, enabling researchers, environmental monitors, and students to effectively track and understand changes happening to our planet's surface. Whether it's monitoring mine rehabilitation, tracking deforestation, or assessing water resources, this platform provides the critical data needed for informed decision-making.
        </p>

      </div>
    </div>
  );
};

export default AboutView;