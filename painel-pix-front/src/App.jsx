// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ModalMultiplos from './widgets/ModalMultiplos';

const App = () => {
  return (
    <Router>
      <div className="bg-light min-vh-100">
        <Header />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

        {/* Modal global */}
        <ModalMultiplos />
      </div>
    </Router>
  );
};

export default App;
