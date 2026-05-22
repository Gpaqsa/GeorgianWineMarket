import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Globe,
  Milestone,
} from "lucide-react";

export default function WineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wine, setWine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/wines/${id}/`)
      .then((res) => {
        setWine(res.data);
        setLoading(false);
      })
      .catch(() => {
        navigate("/"); // თუ ღვინო არ არსებობს, აბრუნებს მთავარზე
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine-primary"></div>
      </div>
    );
  }

  // ფერების ლამაზი თარგმანი UI-სთვის
  const colorMap = {
    RED: "წითელი მშრალი",
    WHITE: "თეთრი მშრალი",
    ROSE: "ვარდისფერი",
    AMBER: "ქარვისფერი (ქვევრის)",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* უკან დაბრუნება */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-wine-primary font-semibold mb-8 hover:underline"
      >
        <ArrowLeft size={16} /> კოლექციაში დაბრუნება
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* 🛠️ მარცხენა მხარე: სურათი მორგებული ზომებით (მხოლოდ ეს ნაწილი შეიცვალა) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-wine-card/20 border border-wine-card/40 rounded-3xl p-4 w-full flex items-center justify-center min-h-[450px] shadow-inner"
        >
          {wine.image ? (
            <img
              src={wine.image}
              alt={wine.title}
              className="w-full h-[418px] object-cover rounded-2xl drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-9xl filter drop-shadow-lg">🍷</span>
          )}
        </motion.div>

        {/* მარჯვენა მხარე: ინფორმაცია */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest bg-wine-primary/10 text-wine-primary px-3 py-1 rounded-full">
              {colorMap[wine.color] || wine.color}
            </span>
            <h1 className="font-serif font-bold text-4xl lg:text-5xl text-wine-dark leading-tight">
              {wine.title}
            </h1>
          </div>

          <p className="text-xl font-serif font-bold text-wine-primary">
            {wine.price} ₾
          </p>

          <p className="text-base opacity-80 leading-relaxed border-t border-b border-wine-card/30 py-4 italic">
            "{wine.description}"
          </p>

          {/* მახასიათებლები */}
          <div className="grid grid-cols-2 gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-wine-card/20 shadow-sm">
              <Globe className="text-wine-primary" size={18} />
              <div>
                <p className="text-xs opacity-50">რეგიონი</p>
                <p className="text-wine-dark">
                  {wine.region_name || wine.region}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-wine-card/20 shadow-sm">
              <Milestone className="text-wine-primary" size={18} />
              <div>
                <p className="text-xs opacity-50">ყურძნის ჯიში</p>
                <p className="text-wine-dark">
                  {wine.grape_variety_name || wine.grape_variety}
                </p>
              </div>
            </div>
          </div>

          {/* გარანტია */}
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
            <ShieldCheck size={16} />
            <span>
              გარანტირებული ხარისხი და ნატურალური პროდუქტი პირდაპირ მარნიდან.
            </span>
          </div>

          {/* კალათაში დამატება */}
          <button
            onClick={() => addToCart(wine)}
            className="w-full bg-wine-primary hover:bg-wine-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer transform active:scale-[0.98]"
          >
            <ShoppingCart size={20} />
            კალათაში დამატება
          </button>
        </motion.div>
      </div>
    </div>
  );
}
