"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, CheckCircle2, User, IndianRupee, Loader2 } from "lucide-react";

export default function ScanBill() {
  const [isScanning, setIsScanning] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [scanResult, setScanResult] = useState<{ customer_name: string; amount: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIsScanning(true);
      try {
        const response = await fetch("http://localhost:8000/api/v1/scan-bill", {
          method: "POST",
        });
        const result = await response.json();
        setScanResult(result);
        setIsScanning(false);
        setIsConfirming(true);
      } catch (error) {
        console.error("Error scanning bill:", error);
        setIsScanning(false);
      }
    }
  };

  const handleConfirm = () => {
    setIsConfirming(false);
    setScanResult(null);
    // In a real app, this would call another API to save the entry
    alert("Bill entry confirmed and added to ledger!");
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleScanClick}
        className="fixed bottom-6 right-28 w-16 h-16 bg-[#002E6E] text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors hover:bg-[#001d45]"
      >
        <Camera className="w-8 h-8" />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />
      </motion.button>

      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[101] flex flex-col items-center justify-center p-6"
          >
            <div className="relative w-72 h-96 border-2 border-[#00BAF2]/30 rounded-3xl overflow-hidden bg-white/5">
              {/* Laser line animation */}
              <motion.div
                animate={{
                  top: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-0 right-0 h-1 bg-[#00BAF2] shadow-[0_0_15px_#00BAF2] z-10"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#00BAF2] animate-spin opacity-20" />
              </div>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-[#00BAF2] text-xl font-bold tracking-widest uppercase"
            >
              Scanning...
            </motion.h2>
          </motion.div>
        )}

        {isConfirming && scanResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[102] flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-[#002E6E]">Confirm Entry</h3>
                <button
                  onClick={() => setIsConfirming(false)}
                  className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 mb-10">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-[#00BAF2] rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Customer</span>
                    <span className="text-lg font-bold text-[#002E6E]">{scanResult.customer_name}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-500 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Amount</span>
                    <span className="text-lg font-bold text-[#002E6E]">₹{scanResult.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-[#00BAF2] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6" />
                Add to Ledger
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
