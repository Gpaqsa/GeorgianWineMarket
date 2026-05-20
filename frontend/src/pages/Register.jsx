import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate("/login"); // გადავიყვანოთ ლოგინზე
    } catch (err) {
      setError("რეგისტრაცია ჩაიშალა. შესაძლოა ეს სახელი უკვე დაკავებულია.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-wine-card/40 shadow-xl max-w-md w-full space-y-6"
      >
        <h2 className="font-serif font-bold text-3xl text-center text-wine-primary">
          რეგისტრაცია
        </h2>
        {error && (
          <p className="text-red-600 text-sm text-center font-medium">
            {error}
          </p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold mb-1 opacity-80">
              მომხმარებლის სახელი
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl bg-wine-bg/40 border border-wine-card/50 focus:outline-none focus:border-wine-primary"
              placeholder="User123"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 opacity-80">
              ელ-ფოსტა
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-wine-bg/40 border border-wine-card/50 focus:outline-none focus:border-wine-primary"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 opacity-80">
              პაროლი
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-wine-bg/40 border border-wine-card/50 focus:outline-none focus:border-wine-primary"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-wine-primary hover:bg-wine-primary/90 text-white font-bold py-3 rounded-xl shadow-md transition-colors"
          >
            რეგისტრაცია
          </button>
        </form>
        <p className="text-center text-sm opacity-80">
          უკვე გაქვს ანგარიში?{" "}
          <Link
            to="/login"
            className="text-wine-primary font-bold hover:underline"
          >
            შედი
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
