import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";

const featureDescription = [
  "Resistance (Ω): Min = 0.000986, Max = 0.004039",
  "Capacitance (F): Min = -0.004263, Max = -0.000535",
  "Magnitude (|Z|): Min = 0.001123, Max = 0.006726",
  "Phase (°): Min = 28.330987, Max = 64.435327",
  "Terminal Voltage (V): Min = 2.5217, Max = 3.6534"
];

export default function BatteryCapacityPredictor() {
  const [impedanceValues, setImpedanceValues] = useState(["", "", "", "", ""]);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const labels = ["Resistance (Ω)", "Capacitance (F)", "Magnitude (|Z|)", "Phase (°)", "Terminal Voltage (V)"];

  const handleInputChange = (index, value) => {
    const updatedValues = [...impedanceValues];
    updatedValues[index] = value;
    setImpedanceValues(updatedValues);
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const response = await axios.post("https://battery-capacity-cnn-nomarlized-inputs.onrender.com/predict", {
        impedance_values: impedanceValues.map(Number),
      });
      setPrediction(response.data.predicted_capacity);
    } catch (err) {
      setError("Failed to get prediction. Please check API connection.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-900 p-10 text-white">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center">
        <Card className="w-full p-12 shadow-xl bg-white rounded-3xl text-center border border-gray-300 flex flex-col items-center text-gray-800">
          <CardContent className="w-full flex flex-col items-center">
            <h1 className="text-4xl font-extrabold mb-10 text-blue-700 text-center drop-shadow-lg"><span role="img" aria-label="battery">🔋</span> Data-driven SOC Estimator</h1>
            <p className="mb-8 text-gray-700 text-lg font-medium text-center max-w-xl leading-relaxed">
              Estimate battery capacity based on impedance and terminal voltage data collected 1 hour after charge interruption.
            </p>
            <div className="mb-10 p-5 bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 rounded-lg shadow-md max-w-xl text-center font-semibold">
              <span role="img" aria-label="lightning">⚡</span> <span className="text-blue-700">Note:</span> The impedance and terminal voltage entered should be collected 1 hour after the interruption of the charging current.
            </div>
            <p className="mb-10 text-gray-800 text-md font-medium text-center"><span role="img" aria-label="bullet point">🔹</span> Key Features Considered:</p>
            <ul className="mb-12 text-gray-600 text-sm bg-gray-100 p-5 rounded-lg font-mono text-center max-w-xl shadow-sm border-l-4 border-blue-500">
              {featureDescription.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <div className="grid grid-cols-1 gap-8 w-full max-w-md">
              {impedanceValues.map((val, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  <label className="mb-2 text-gray-800 font-semibold text-lg">{labels[index]}</label>
                  <input
                    type="number"
                    className="border border-gray-400 rounded-lg p-4 text-center w-full text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md bg-gray-50"
                    value={val}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={`Enter ${labels[index].toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-16 w-full">
              <Button className="w-full max-w-md bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-indigo-900 text-white font-bold py-5 px-8 rounded-lg shadow-lg text-xl transition duration-300 transform hover:scale-105" onClick={handleSubmit}>
                <span role="img" aria-label="gear">⚙️</span> Predict Capacity
              </Button>
            </div>
            {prediction !== null && (
              <p className="mt-14 text-center text-3xl font-bold text-green-700 drop-shadow-lg"><span role="img" aria-label="chart">📊</span> Predicted SOC: {(prediction * 100).toFixed(2)}%</p>
            )}
            {error && <p className="mt-8 text-center text-red-500 font-medium text-lg"><span role="img" aria-label="error">❌</span> {error}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
