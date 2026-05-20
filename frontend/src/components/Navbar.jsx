import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // შემოგვაქვს ავტორიზაციის კონტექსტი
import { Wine as WineIcon, ShoppingCart, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth(); // ვიღებთ იუზერის ინფორმაციას და სისტემიდან გამოსვლის ფუნქციას

  return (
    <nav className="sticky top-0 z-50 bg-wine-bg/80 backdrop-blur-md border-b border-wine-card/40 px-6 py-4 flex justify-between items-center">
      {/* ლოგო */}
      <Link
        to="/"
        className="flex items-center gap-2 cursor-pointer text-wine-primary"
      >
        <WineIcon className="w-8 h-8" />
        <span className="font-serif font-bold text-2xl tracking-wide">
          მოსავალი
        </span>
      </Link>

      {/* მარჯვენა მენიუ */}
      <div className="flex items-center gap-4">
        {/* თუ იუზერი შესულია, ვუჩვენებთ სახელს, თუ არა - შესვლის ღილაკს */}
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="hover:text-wine-primary transition-colors font-medium"
            >
              
            <span className="text-sm font-semibold text-wine-dark bg-wine-card/30 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <User size={14} /> {user.username}
              </span>
            </Link>
            <button
              onClick={logout}
              className="text-red-700 hover:text-red-900 p-2 transition-colors cursor-pointer"
              title="გამოსვლა"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-wine-dark hover:text-wine-primary p-2 transition-colors flex items-center gap-1 font-medium text-sm"
          >
            <User size={18} /> შესვლა
          </Link>
        )}

        {/* კალათა */}
        <Link
          to="/cart"
          className="relative cursor-pointer p-2 bg-wine-card/30 rounded-full hover:bg-wine-card/60 transition-colors block text-wine-dark"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <motion.span
              key={totalItems}
              initial={{ scale: 0.6 }}
              animate={{ scale: [1.3, 1] }}
              className="absolute -top-1 -right-1 bg-wine-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
            >
              {totalItems}
            </motion.span>
          )}
        </Link>
      </div>
    </nav>
  );
}
