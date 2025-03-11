import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";

const featureDescription = `
Resistance (Ω): Min = 0.000986, Max = 0.002039 |
Capacitance (F): Min = -0.004263, Max = -0.000535 |
Magnitude (|Z|): Min = 0.001123, Max = 0.004726 |
Phase (°): Min = 28.330987, Max = 64.435327 |
Terminal Voltage (V): Min = 2.592178, Max = 3.394653
`;

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
      const response = await axios.post("https://battery-capacity-cnn-2.onrender.com/predict", {
        impedance_values: impedanceValues.map(Number),
      });
      setPrediction(response.data.predicted_capacity);
    } catch (err) {
      setError("Failed to get prediction. Please check API connection.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-2xl p-8 shadow-xl bg-white rounded-2xl text-center">
        <CardContent>
          <h1 className="text-3xl font-bold mb-4 text-blue-600">Data-drivne SOC estimator based on EIS and terminal voltage</h1>
          <p className="mb-6 text-gray-500"> This tool estimates battery capacity based on impedance parameters measured from the battery. </p>
          <p className="mb-6 text-gray-500"> By entering key electrical properties, the model predicts the remaining capacity of the battery using a trained deep learning model.</p>
          <p className="mb-6 text-blue-600"> Note: The impedance and terminal voltage entered here should be collected 1 hour after the interuption of the charging current.</p>
          <p className="mb-6 text-gray-600">
            This tool predicts battery capacity based on impedance parameters measured from the battery. 
            The model takes the following features into account:
          </p>
          <p className="mb-6 text-gray-500 text-sm">
            {featureDescription}
          </p>
          <div className="grid grid-cols-1 gap-6">
            {impedanceValues.map((val, index) => (
              <div key={index} className="flex flex-col items-center">
                <label className="mb-2 text-gray-700 font-medium text-lg">{labels[index]}</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded-lg p-4 text-center w-3/4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={val}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`Enter ${labels[index].toLowerCase()}`}
                />
              </div>
            ))}
          </div>
          <Button className="w-3/4 mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-md text-lg transition duration-300" onClick={handleSubmit}>
            Predict
          </Button>
          {prediction !== null && (
            <p className="mt-8 text-center text-2xl font-semibold text-green-600">Predicted Capacity: {prediction}</p>
          )}
          {error && <p className="mt-4 text-center text-red-500 font-medium text-lg">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
