import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  Package,
} from "lucide-react";

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null); // რომელი შეკვეთაა ჩამოშლილი

  useEffect(() => {
    const token = localStorage.getItem("token"); // ან შენი ავტორიზაციის კონტექსტიდან

    axios
      .get("https://georgianwinemarket.onrender.com/api/orders/my/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("შეკვეთების წამოღება ჩაიშალა", err);
        setLoading(false);
      });
  }, []);

  // სტატუსის ვიზუალური გაფორმება
  const getStatusDetails = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: "text-emerald-700 bg-emerald-50 border-emerald-100",
          icon: <CheckCircle2 size={16} />,
        };
      case "CANCELLED":
        return {
          color: "text-rose-700 bg-rose-50 border-rose-100",
          icon: <XCircle size={16} />,
        };
      default:
        return {
          color: "text-amber-700 bg-amber-50 border-amber-100",
          icon: <Clock size={16} />,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-wine-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8 border-b border-wine-card/20 pb-6">
        <div className="w-16 h-16 rounded-full bg-wine-primary/10 flex items-center justify-center text-wine-primary">
          <User size={32} />
        </div>
        <div>
          <h1 className="font-serif font-bold text-3xl text-wine-dark">
            პირადი კაბინეტი
          </h1>
          <p className="text-sm opacity-60">
            შენი შეკვეთების ისტორია და სტატუსები
          </p>
        </div>
      </div>

      <h2 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
        <Package size={20} className="text-wine-primary" /> შეკვეთების ისტორია (
        {orders.length})
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-wine-card/40 rounded-2xl opacity-60 bg-wine-card/5">
          შეკვეთები ჯერ არ გაგიფორმებია 🍷
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusStyle = getStatusDetails(order.status);
            const isExpanded = activeOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white border border-wine-card/20 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* შეკვეთის მთავარი ზოლი */}
                <div
                  onClick={() => setActiveOrder(isExpanded ? null : order.id)}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-wine-card/5 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs opacity-50 uppercase font-bold tracking-wider">
                        შეკვეთის ID
                      </p>
                      <p className="font-bold text-wine-dark">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-50 uppercase font-bold tracking-wider">
                        თარიღი
                      </p>
                      <p className="text-sm flex items-center gap-1 opacity-80">
                        <Calendar size={14} />{" "}
                        {new Date(order.created_at).toLocaleDateString("ka-GE")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs opacity-50 uppercase font-bold tracking-wider">
                        ჯამური ფასი
                      </p>
                      <p className="font-serif font-bold text-wine-primary">
                        {order.total_price} ₾
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle.color}`}
                    >
                      {statusStyle.icon}
                      {order.status_display}
                    </span>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                      <ChevronDown size={18} className="opacity-50" />
                    </motion.div>
                  </div>
                </div>

                {/* ჩამოსაშლელი ნაწილი - პროდუქტების სია */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-wine-card/10 bg-wine-card/5 p-5 space-y-3"
                  >
                    <p className="text-xs uppercase font-bold tracking-wider opacity-50 mb-2">
                      შეკვეთილი ნივთები:
                    </p>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-white p-3 rounded-xl border border-wine-card/10 text-sm"
                      >
                        <span className="font-medium text-wine-dark">
                          {item.wine_title}
                        </span>
                        <div className="space-x-4 opacity-80">
                          <span>{item.quantity} ცალი</span>
                          <span className="font-semibold text-wine-primary">
                            {item.price} ₾
                          </span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
