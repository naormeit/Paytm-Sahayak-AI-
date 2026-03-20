"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X } from "lucide-react";

export default function SahayakVoice() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#00BAF2] text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors hover:bg-[#009ac7]"
      >
        <Mic className="w-8 h-8" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6 text-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-[#002E6E] mb-2">How can I help you?</h2>
              <p className="text-gray-500 text-lg">"Update Khata for Ramesh" or "Show today's sales"</p>
            </motion.div>

            <div className="flex items-center justify-center gap-2 h-32">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [20, 80, 20],
                    backgroundColor: ["#00BAF2", "#002E6E", "#00BAF2"],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                  className="w-2 rounded-full"
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-[#00BAF2] font-semibold text-lg"
            >
              Listening...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
