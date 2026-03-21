"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Mic, Camera, TrendingUp, AlertCircle, Wallet, Users, ArrowUpRight, ShoppingBag, Receipt } from "lucide-react";

interface DashboardSummary {
  top_debtors: string[];
  credit_health_score: number;
  morning_briefing: string;
  // New fields for StatsGrid (added as optional to maintain compatibility with backend for now)
  total_sales?: string;
  outstanding_udhaar?: string;
  active_debtors_count?: number;
}

const MOCK_DATA: DashboardSummary = {
  top_debtors: ["Rahul (Mock): ₹1500.00", "Priya (Mock): ₹850.00", "Amit (Mock): ₹320.00"],
  credit_health_score: 75,
  morning_briefing: "Offline Mode: Unable to reach the database or Gemini AI Engine. displaying sample datastream. Rahul and Priya owe you roughly ₹2,350.00.",
  total_sales: "₹12,450.00",
  outstanding_udhaar: "₹2,350.00",
  active_debtors_count: 8,
};

function SahayakDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/dashboard-summary");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        
        // Ensure mock fields are present if backend doesn't provide them
        const enrichedData = {
            ...MOCK_DATA, // Use mock as base
            ...json,      // Override with real data
        };
        setData(enrichedData);
        console.log("UI Rendered with:", enrichedData);
      } catch (err: any) {
        console.error("Fetch failed, using mock data:", err);
        setData(MOCK_DATA);
        console.log("UI Rendered with:", MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (!mounted) return <div className="bg-[#f8f9fa] min-h-screen" />;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans p-6">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#00BAF2] text-white p-2 rounded-xl">
            <Wallet size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#00BAF2]">Sahayak AI</h1>
            <p className="text-sm text-gray-500 font-medium">Agentic Khata Management</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition text-[#00BAF2]">
            <Mic size={18} />
            Ask Sahayak
          </button>
          <button className="flex items-center gap-2 bg-[#00BAF2] text-white shadow-md hover:shadow-lg px-4 py-2 rounded-full text-sm font-medium hover:bg-[#0096c7] transition">
            <Camera size={18} />
            Scan Bill
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00BAF2] mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Running Agentic Analysis...</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Morning Briefing Banner */}
            <div className="bg-gradient-to-r from-[#00BAF2] to-[#008cc9] text-white p-8 rounded-2xl shadow-lg flex items-center gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 opacity-10 transform translate-x-12 -translate-y-12">
                  <TrendingUp size={200} />
               </div>
               <div className="bg-white/20 p-5 rounded-full backdrop-blur-sm z-10">
                 <TrendingUp size={36} />
               </div>
               <div className="z-10">
                 <h2 className="text-2xl font-bold mb-2 tracking-tight">Morning Briefing</h2>
                 <p className="text-white/95 text-lg leading-relaxed font-medium">{data.morning_briefing}</p>
               </div>
            </div>

            {/* StatsGrid: 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="bg-blue-50 text-[#00BAF2] w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingBag size={20} />
                </div>
                <p className="text-sm text-gray-500 font-medium">Total Sales</p>
                <h3 className="text-xl font-bold text-gray-900">{data.total_sales}</h3>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="bg-orange-50 text-orange-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Receipt size={20} />
                </div>
                <p className="text-sm text-gray-500 font-medium">Outstanding Udhaar</p>
                <h3 className="text-xl font-bold text-gray-900">{data.outstanding_udhaar}</h3>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="bg-green-50 text-green-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp size={20} />
                </div>
                <p className="text-sm text-gray-500 font-medium">Credit Score</p>
                <h3 className="text-xl font-bold text-gray-900">{data.credit_health_score}</h3>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="bg-purple-50 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Users size={20} />
                </div>
                <p className="text-sm text-gray-500 font-medium">Active Debtors</p>
                <h3 className="text-xl font-bold text-gray-900">{data.active_debtors_count}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top Debtors Section */}
              <div className="col-span-1 md:col-span-2 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                    <AlertCircle size={20} className="text-orange-500" />
                    Top Debtors
                  </h3>
                  <span className="text-sm text-[#00BAF2] font-semibold cursor-pointer hover:underline">View All &rarr;</span>
                </div>
                <div className="space-y-4">
                  {data.top_debtors.map((debtor, idx) => {
                    const [name, amount] = debtor.split(':');
                    return (
                      <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="bg-orange-100/70 text-orange-600 p-2.5 rounded-full">
                            <Users size={18} />
                          </div>
                          <span className="font-semibold text-gray-700">{name}</span>
                        </div>
                        <div className="flex items-center gap-5">
                          <span className="font-bold text-gray-900 tracking-tight">{amount}</span>
                          <button className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 hover:text-[#00BAF2] font-semibold text-gray-600 flex items-center gap-1 transition">
                             Remind <ArrowUpRight size={14}/>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Credit Health Score Visualization */}
              <div className="col-span-1 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center">
                 <h3 className="text-xl font-bold mb-6 text-gray-800 tracking-tight">Credit Health</h3>
                 <div className="relative w-40 h-40 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f3f4f6" strokeWidth="14" />
                      <circle cx="80" cy="80" r="70" fill="transparent" stroke={data.credit_health_score > 70 ? "#10b981" : "#f59e0b"} strokeWidth="14" strokeDasharray={2 * Math.PI * 70} strokeDashoffset={2 * Math.PI * 70 * (1 - data.credit_health_score / 100)} className="transition-all duration-1000 ease-out stroke-current" strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-4xl font-extrabold text-gray-900">{data.credit_health_score}</span>
                     <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Score</span>
                   </div>
                 </div>
                 <p className="mt-8 text-sm font-medium text-gray-500 px-4">
                   {data.credit_health_score > 70 ? "Your khata health is excellent. Cash flow is optimal." : "High amount of unpaid khata. Consider sending reminders."}
                 </p>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(SahayakDashboard), { ssr: false });
