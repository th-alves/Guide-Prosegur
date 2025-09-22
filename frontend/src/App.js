import React, { useState } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Dashboard />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;