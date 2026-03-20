"use client";

import { motion } from "framer-motion";
import { TrendingUp, Heart, Wallet } from "lucide-react";

interface StatsGridProps {
  totalSales: number;
  creditHealthScore: number;
  pendingKhata: number;
}

export default function StatsGrid({ totalSales, creditHealthScore, pendingKhata }: StatsGridProps) {
  const stats = [
    {
      label: "Total Sales",
      value: `₹${totalSales.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: "text-[#00BAF2]",
    },
    {
      label: "Credit Health Score",
      value: `${creditHealthScore}/100`,
      icon: Heart,
      color: "text-red-500",
    },
    {
      label: "Pending Khata",
      value: `₹${pendingKhata.toLocaleString('en-IN')}`,
      icon: Wallet,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-[#002E6E]">{stat.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
