import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Login from "./components/pages/Login";

const App = () => {
  return (
    <Routes>
      {/* Login page - NO Navbar/Footer */}
      <Route path="/login" element={<Login />} />
      
      {/* Other pages - WITH Navbar/Footer */}
      <Route path="/" element={
        <div>
          <div className="max-w-7xl mx-auto px-4">
            <Navbar />
          </div>
          <main>
            <div className="max-w-7xl mx-auto px-4">
              <h1>Home Page</h1>
            </div>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  );
};

export default App;