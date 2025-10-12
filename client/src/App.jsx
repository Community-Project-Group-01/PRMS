import React from "react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

const App = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />
      </div>
      <Footer />
    </div>
  );
};

export default App;