"use client";

import { motion } from "framer-motion";
import { MessageCircle, AlertCircle } from "lucide-react";

interface DebtAlertsProps {
  topDebtors: string[];
}

export default function DebtAlerts({ topDebtors }: DebtAlertsProps) {
  const handleWhatsAppReminder = (debtor: string) => {
    const [name, amount] = debtor.split(": ₹");
    const message = `Namaste ${name}, this is a friendly reminder for your pending Khata balance of ₹${amount}. Please clear it soon. Thank you!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-[#002E6E]">Top Debtors</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {topDebtors.map((debtor, index) => {
            const [name, amount] = debtor.split(": ");
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-[#002E6E]">{name}</span>
                  <span className="text-sm text-red-500 font-medium">{amount} Pending</span>
                </div>
                <button
                  onClick={() => handleWhatsAppReminder(debtor)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00BAF2] text-white rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Remind</span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
