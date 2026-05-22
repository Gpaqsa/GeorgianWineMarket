import React, { useState, useEffect } from "react";
import axios from "axios"; // 👈 გასწორდა სტანდარტულზე
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Wine as WineIcon, RefreshCw } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [wines, setWines] = useState([]);
  const [regions, setRegions] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ფილტრების სახელმწიფოები
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("");

  // ვიყენებთ გლობალურ ფუნქციას კალათაში დასამატებლად
  const { addToCart } = useCart();

  // მონაცემების წამოღება ბექენდიდან
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [regionsRes, varietiesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/regions/"),
          axios.get("http://127.0.0.1:8000/api/varieties/"),
        ]);
        setRegions(regionsRes.data);
        setVarieties(varietiesRes.data);
      } catch (err) {
        console.error("ბაზისური მონაცემების წამოღება ჩაიშალა", err);
      }
    };
    fetchInitialData();
  }, []);

  // ღვინოების წამოღება ფილტრების მიხედვით
  useEffect(() => {
    const fetchWines = async () => {
      setLoading(true);
      try {
        let url = "http://127.0.0.1:8000/api/wines/?";
        if (selectedColor) url += `color=${selectedColor}&`;
        if (selectedRegion) url += `region=${selectedRegion}&`;
        if (selectedVariety) url += `variety=${selectedVariety}&`;

        const res = await axios.get(url);
        setWines(res.data);
      } catch (err) {
        console.error("ღვინოების წამოღება ჩაიშალა", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWines();
  }, [selectedColor, selectedRegion, selectedVariety]);

  const resetFilters = () => {
    setSelectedColor("");
    setSelectedRegion("");
    setSelectedVariety("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* მარცხენა პანელი: ფილტრები */}
      <motion.aside
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-wine-card/40 p-6 rounded-2xl border border-wine-card/60 h-fit space-y-6"
      >
        <div className="flex justify-between items-center border-b border-wine-dark/10 pb-3">
          <h2 className="font-serif font-bold text-xl flex items-center gap-2">
            <Filter size={18} /> ფილტრაცია
          </h2>
          {(selectedColor || selectedRegion || selectedVariety) && (
            <button
              onClick={resetFilters}
              className="text-sm text-wine-primary hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} /> გასუფთავება
            </button>
          )}
        </div>

        {/* ფილტრი: ფერი */}
        <div>
          <label className="block font-semibold mb-2 text-sm opacity-80">
            ღვინის ფერი
          </label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-wine-bg border border-wine-card text-wine-dark focus:outline-none focus:border-wine-primary transition-colors"
          >
            <option value="">ყველა ფერი</option>
            <option value="RED">წითელი</option>
            <option value="WHITE">თეთრი</option>
            <option value="ROSE">ვარდისფერი</option>
            <option value="AMBER">ქარვისფერი (ქვევრის)</option>
          </select>
        </div>

        {/* ფილტრი: რეგიონები */}
        <div>
          <label className="block font-semibold mb-2 text-sm opacity-80">
            რეგიონი
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-wine-bg border border-wine-card text-wine-dark focus:outline-none focus:border-wine-primary transition-colors"
          >
            <option value="">ყველა რეგიონი</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* ფილტრი: ჯიშები */}
        <div>
          <label className="block font-semibold mb-2 text-sm opacity-80">
            ყურძნის ჯიში
          </label>
          <select
            value={selectedVariety}
            onChange={(e) => setSelectedVariety(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-wine-bg border border-wine-card text-wine-dark focus:outline-none focus:border-wine-primary transition-colors"
          >
            <option value="">ყველა ჯიში</option>
            {varieties.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </motion.aside>

      {/* მარჯვენა პანელი: პროდუქტების Grid */}
      <main className="md:col-span-3">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-10 h-10 border-4 border-wine-primary border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {wines.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center text-lg py-12 opacity-60 italic"
                >
                  ღვინო მოცემული ფილტრებით ვერ მოიძებნა...
                </motion.p>
              ) : (
                wines.map((wine) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -8 }}
                    key={wine.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-wine-card/30 transition-shadow duration-300 flex flex-col justify-between"
                  >
                    {/* 🔗 სურათი გადავა დეტალურ გვერდზე */}
                    <Link
                      to={`/wine/${wine.id}`}
                      className="h-56 bg-wine-card/20 flex items-center justify-center relative overflow-hidden block cursor-pointer group"
                    >
                      {wine.image ? (
                        <img
                          src={wine.image}
                          alt={wine.title}
                          className="h-full object-cover w-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <WineIcon className="w-16 h-16 text-wine-card" />
                      )}
                      <span className="absolute bottom-3 left-3 bg-wine-dark/10 backdrop-blur-md text-wine-dark px-2.5 py-1 rounded-md text-xs font-semibold">
                        {wine.region_details?.name}
                      </span>
                    </Link>

                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        {/* 🔗 სათაურიც გადავა დეტალურ გვერდზე */}
                        <Link
                          to={`/wine/${wine.id}`}
                          className="block group cursor-pointer"
                        >
                          <h3 className="font-serif font-bold text-lg text-wine-dark group-hover:text-wine-primary transition-colors">
                            {wine.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-wine-primary font-medium tracking-wider mt-1 uppercase">
                          {wine.grape_variety_details?.name} • {wine.color}
                        </p>
                        <p className="text-sm text-wine-dark/70 line-clamp-2 mt-2">
                          {wine.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="font-serif font-bold text-xl text-wine-primary">
                          {wine.price} ₾
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(wine)}
                          className="bg-wine-primary hover:bg-wine-primary/90 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md transition-colors cursor-pointer"
                        >
                          დამატება
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
