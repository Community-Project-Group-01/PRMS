import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("");

  useEffect(() => {
    fetchServerStatus();
  }, []);

  const fetchServerStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/`);
      setMessage(response.data.message);
      setServerStatus("Connected ✅");
    } catch (error) {
      console.error("Error connecting to server:", error);
      setMessage("Error connecting to server");
      setServerStatus("Disconnected ❌");
    } finally {
      setLoading(false);
    }
  };

  const testAuthRoute = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/test`);
      alert(`Auth Route Test: ${response.data.message}`);
    } catch (error) {
      alert("Error testing auth route");
    }
  };

  const testUsersRoute = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/test`);
      alert(`Users Route Test: ${response.data.message}`);
    } catch (error) {
      alert("Error testing users route");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 PRMS MERN Stack App</h1>
        <div style={{ margin: "20px 0" }}>
          <p>
            <strong>Server Status:</strong> {serverStatus}
          </p>
          {loading ? <p>Loading...</p> : <p>{message}</p>}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button onClick={fetchServerStatus} disabled={loading}>
            🔄 Refresh Status
          </button>
          <button onClick={testAuthRoute}>🔐 Test Auth Route</button>
          <button onClick={testUsersRoute}>👥 Test Users Route</button>
        </div>

        <div style={{ marginTop: "30px", fontSize: "14px", opacity: 0.7 }}>
          <p>Frontend: React (Port 3000)</p>
          <p>Backend: Express (Port 5000)</p>
          <p>Database: MongoDB</p>
        </div>
      </header>
    </div>
  );
}

export default App;
