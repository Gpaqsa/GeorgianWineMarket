import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from './context/AuthContext'; // შემოიტანე თავში
import WineDetail from './pages/WineDetail';
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      {" "}
      {/* შემოახვიე აპი ავტენტიკაციის პროვაიდერში */}
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-wine-bg text-wine-dark font-sans">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/wine/:id" element={<WineDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
