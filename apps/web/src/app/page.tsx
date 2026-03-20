"use client";

import { useEffect, useState } from "react";
import StatsGrid from "@/components/StatsGrid";
import DebtAlerts from "@/components/DebtAlerts";
import SahayakVoice from "@/components/SahayakVoice";
import ScanBill from "@/components/ScanBill";
import { motion } from "framer-motion";
import { Bell, UserCircle, Search } from "lucide-react";

interface DashboardData {
  top_debtors: string[];
  credit_health_score: number;
  total_sales: number;
  pending_khata: number;
  morning_briefing: string;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/dashboard-summary");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00BAF2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans max-w-[450px] mx-auto shadow-2xl relative">
      {/* Header */}
      <header className="bg-white px-6 py-6 sticky top-0 z-40 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-[#002E6E] text-2xl font-bold">Sahayak AI</h1>
            <span className="text-gray-500 text-sm font-medium">Merchant Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 bg-gray-50 rounded-full text-[#002E6E]">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-2 bg-gray-50 rounded-full text-[#002E6E]">
              <UserCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search transactions, customers..."
            className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#00BAF2] transition-all"
          />
        </div>
      </header>

      <main>
        {/* Morning Briefing Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-4 mt-6 p-6 bg-gradient-to-br from-[#00BAF2] to-[#002E6E] rounded-3xl text-white shadow-lg shadow-blue-100"
        >
          <h2 className="text-xl font-bold mb-2">Good Morning! ☀️</h2>
          <p className="text-blue-50/90 leading-relaxed font-medium">
            {data?.morning_briefing || "Welcome back to your dashboard."}
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <section className="mt-4">
          <StatsGrid
            totalSales={data?.total_sales || 0}
            creditHealthScore={data?.credit_health_score || 0}
            pendingKhata={data?.pending_khata || 0}
          />
        </section>

        {/* Debt Alerts */}
        <section>
          <DebtAlerts topDebtors={data?.top_debtors || []} />
        </section>

        {/* Quick Actions (Apple Style) */}
        <section className="px-4 mt-4">
          <h3 className="text-[#002E6E] font-bold text-lg mb-4 px-2">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-50 text-[#00BAF2] rounded-2xl flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-[#002E6E] font-semibold text-sm">View Reports</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                <UserCircle className="w-6 h-6" />
              </div>
              <span className="text-[#002E6E] font-semibold text-sm">Add Customer</span>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Voice and Scan Buttons */}
      <ScanBill />
      <SahayakVoice />
    </div>
  );
}
