import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // 🔐 შემოგვაქვს აუთენტურობა
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } =
    useCart();
  const { user, token } = useAuth(); // ვიღებთ იუზერს და ტოკენს
  const [isOrdered, setIsOrdered] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      setError("შეკვეთის გასაფორმებლად გთხოვთ, ჯერ გაიაროთ ავტორიზაცია!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ვუგზავნით ბექენდს კალათის მონაცემებს + ბეარერ ტოკენს
      await axios.post(
        "https://georgianwinemarket.onrender.com/orders/",
        {
          cartItems: cartItems,
          totalPrice: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 უსაფრთხოების ტოკენი
          },
        },
      );

      setIsOrdered(true);
      clearCart();
    } catch (err) {
      setError("შეკვეთის გაფორმება ჩაიშალა. სცადეთ მოგვიანებით.");
    } finally {
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <CheckCircle className="text-wine-primary w-20 h-20 mb-4" />
        </motion.div>
        <h2 className="font-serif font-bold text-3xl text-wine-dark mb-2">
          გილოცავთ! შეკვეთა ბაზაში შეინახა
        </h2>
        <p className="opacity-80 mb-6">
          თქვენი შეკვეთა წარმატებით დარეგისტრირდა ჩვენს სისტემაში.
        </p>
        <Link
          to="/"
          className="bg-wine-primary text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-wine-primary/90 transition-colors"
        >
          მთავარ გვერდზე დაბრუნება
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-wine-primary font-semibold mb-6 hover:underline"
      >
        <ArrowLeft size={16} /> მაღაზიაში დაბრუნება
      </Link>

      <h1 className="font-serif font-bold text-3xl text-wine-dark mb-8">
        შენი კალათა
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={18} /> {error}
          {!user && (
            <Link to="/login" className="underline ml-auto font-bold">
              შესვლა
            </Link>
          )}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="bg-wine-card/20 border border-wine-card/40 rounded-2xl p-12 text-center">
          <p className="text-lg opacity-60 italic mb-6">კალათა ცარიელია...</p>
          <Link
            to="/"
            className="bg-wine-primary text-white px-6 py-2.5 rounded-xl font-semibold"
          >
            შეარჩიე ღვინო
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ნივთების სია */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-wine-card/30 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-wine-bg/40 rounded-xl flex items-center justify-center font-bold text-wine-primary">
                    🍷
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-wine-dark">
                      {item.title}
                    </h3>
                    <p className="text-sm text-wine-primary font-semibold">
                      {item.price} ₾
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-wine-bg/50 px-2 py-1 rounded-lg border border-wine-card/30">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:text-wine-primary cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:text-wine-primary cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 p-2 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* შეჯამება და ყიდვა */}
          <div className="bg-wine-card/30 p-6 rounded-2xl border border-wine-card/60 h-fit space-y-4">
            <h2 className="font-serif font-bold text-xl border-b border-wine-dark/10 pb-3">
              შეკვეთის ჯამი
            </h2>
            <div className="flex justify-between font-medium">
              <span>სულ გადასახდელი:</span>
              <span className="text-xl font-serif font-bold text-wine-primary">
                {totalPrice.toFixed(2)} ₾
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-wine-primary hover:bg-wine-primary/90 text-white font-bold py-3 rounded-xl shadow-lg transition-colors mt-2 cursor-pointer disabled:bg-wine-card"
            >
              {loading ? "მუშავდება..." : "შესყიდვის დასრულება"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
