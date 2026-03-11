import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DriverDashboard from './pages/DriverDashboard';
import RiderDashboard from './pages/RiderDashboard';
import Payment from './pages/Payment';
import Rating from './pages/Rating';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/driver" element={<DriverDashboard />} />
              <Route path="/rider-dashboard" element={<RiderDashboard />} />
              <Route path="/payment/:rideId" element={<Payment />} />
              <Route path="/rate/:rideId" element={<Rating />} />
            </Routes>
          </main>
          <footer className="bg-primary text-gray-400 p-8 text-center border-t border-gray-800">
            <p>&copy; 2026 Cabby Technologies Inc. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
