# app.py - Corrected and fully aligned backend

import io
import os
import tempfile
import traceback
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import rasterio
import numpy as np
import matplotlib.pyplot as plt
import ee

app = Flask(__name__)
CORS(app)

# Initialize Earth Engine
try:
    ee.Initialize()
    print("SUCCESS: Google Earth Engine initialized.")
except Exception as e:
    print(f"ERROR: Could not initialize Earth Engine: {e}")

# -------------------------------
# User management
# -------------------------------
users = {}

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"message": "Username and password are required."}), 400
    if username in users:
        return jsonify({"message": "Username already exists."}), 409
    users[username] = {"password": password}
    return jsonify({"message": "Registration successful!"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = users.get(username)
    if user and user["password"] == password:
        return jsonify({"message": "Login successful."}), 200
    return jsonify({"message": "Invalid credentials."}), 401

# -------------------------------
# Helper: Index calculation
# -------------------------------
def calculate_index_from_arrays(band_arrays, index_type):
    B2, B3, B4, B5, B6 = band_arrays
    if index_type == "NDVI":
        return (B5 - B4) / (B5 + B4 + 1e-10)
    elif index_type == "NDWI":
        return (B3 - B5) / (B3 + B5 + 1e-10)
    elif index_type == "MNDWI":
        return (B3 - B6) / (B3 + B6 + 1e-10)
    elif index_type == "EVI":
        return 2.5 * (B5 - B4) / (B5 + 6*B4 - 7.5*B2 + 1e-10)
    else:
        raise ValueError("Unsupported index type")

# -------------------------------
# Single-year analysis with uploaded bands
# -------------------------------
@app.route('/upload-bands-analysis', methods=['POST'])
def upload_bands_analysis():
    try:
        index_type = request.form.get("indexType", "NDVI")
        boundary = request.form.get("studyArea", "Study Area")
        year = request.form.get("year", "2023")
        files = request.files.getlist("bands")

        if not files or len(files) < 5:
            return jsonify({"message": "Please upload at least 5 GeoTIFF bands (B2-B6)."}), 400

        # Read bands
        band_arrays = []
        transforms = []
        for f in files:
            with rasterio.open(f) as src:
                band_arrays.append(src.read(1).astype(np.float32))
                transforms.append(src.transform)

        # Use first band transform (assuming all aligned)
        transform = transforms[0]

        # Calculate index
        index_array = calculate_index_from_arrays(band_arrays, index_type)

        # Handle coordinates if sent
        coordinates = []
        i = 0
        while True:
            lat = request.form.get(f"coordinates[{i}][lat]")
            lon = request.form.get(f"coordinates[{i}][lon]")
            if lat is None or lon is None:
                break
            try:
                lat_f = float(lat)
                lon_f = float(lon)
                # Convert lat/lon to row/col
                row, col = rasterio.transform.rowcol(transform, lon_f, lat_f)
                value = float(index_array[row, col])
                coordinates.append({"lat": lat, "lon": lon, "value": value})
            except Exception:
                coordinates.append({"lat": lat, "lon": lon, "value": None})
            i += 1

        # Generate image for frontend preview
        plt.figure(figsize=(6,6))
        plt.imshow(index_array, cmap="RdYlGn" if index_type=="NDVI" else "BrBG")
        plt.colorbar()
        plt.title(f"{index_type} - {year}")
        buf = io.BytesIO()
        plt.savefig(buf, format="PNG")
        plt.close()
        buf.seek(0)

        # Save temporary file to serve
        tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        tmp_file.write(buf.getvalue())
        tmp_file.close()

        return jsonify({
            "resultImageUrl": f"/download-result?file={tmp_file.name}",
            "coordinates": coordinates,
            "message": "Analysis completed successfully."
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": f"Error processing bands: {str(e)}"}), 500

@app.route('/download-result', methods=['GET'])
def download_result():
    file_path = request.args.get("file")
    if not file_path or not os.path.exists(file_path):
        return jsonify({"message":"File not found"}), 404
    return send_file(file_path, mimetype="image/png", as_attachment=False)

# -------------------------------
# Multi-year video analysis (GEE)
# -------------------------------
@app.route('/api/analysis/perform-gee-video', methods=['POST'])
def perform_gee_video():
    try:
        data = request.get_json()
        poly = data.get('polygon')
        analysis_type = data.get('analysisType','NDVI')
        start_year = int(data.get('startYear'))
        end_year = int(data.get('endYear'))
        if not poly: return jsonify({"message":"Missing polygon"}),400
        aoi = ee.Geometry.Polygon(poly)

        def annual_reducer(y):
            start_date = ee.Date.fromYMD(ee.Number(y).int(),1,1)
            end_date = start_date.advance(1,'year')
            img = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
                .filterBounds(aoi).filterDate(start_date,end_date).sort('CLOUD_COVER').first()
            if img is None: return ee.Image().rename("empty")
            nir = img.select('SR_B5')
            red = img.select('SR_B4')
            green = img.select('SR_B3')
            if analysis_type=="NDVI":
                idx_img = nir.subtract(red).divide(nir.add(red)).rename("NDVI")
            else:  # NDWI
                idx_img = green.subtract(nir).divide(green.add(nir)).rename("NDWI")
            return idx_img.set('year', ee.Number(y))

        years_ee = ee.List.sequence(start_year,end_year)
        images = years_ee.map(lambda yy: annual_reducer(ee.Number(yy)))
        index_collection = ee.ImageCollection.fromImages(images)

        vis_params = {'min':-0.2,'max':0.8,'palette':['red','yellow','green']} if analysis_type=="NDVI" \
            else {'min':-0.5,'max':0.5,'palette':['brown','white','blue']}
        video_args = {'dimensions':720,'region':aoi,'framesPerSecond':1,'crs':'EPSG:3857',**vis_params}
        video_url = index_collection.getVideoThumbURL(video_args)

        return jsonify({"videoUrl": video_url, "message": f"Time-lapse from {start_year} to {end_year}"})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": f"Error: {str(e)}"}), 500

if __name__=='__main__':
    app.run(port=5000, debug=True)
