"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, X } from "lucide-react";

export function BuyMeCoffeeButton() {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleBuyClick = () => {
    window.open("https://buymeacoffee.com", "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Button */}
      <motion.button
        onClick={handleClick}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, rotate: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-secondary neo-border neo-shadow px-4 py-3 font-bold text-sm group hover:bg-secondary/90 transition-colors"
      >
        <Coffee className="w-5 h-5 group-hover:animate-bounce" />
        <span className="hidden sm:inline">BUY ME A COFFEE</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card neo-border neo-shadow max-w-md w-full p-8 relative"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-muted neo-border transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary neo-border p-3">
                    <Coffee className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold">Support This Project</h2>
                </div>

                <p className="text-base text-muted-foreground leading-relaxed">
                  If you find this Life Calendar app helpful and want to support
                  its development, consider buying me a coffee! ☕ Your support
                  helps me continue building amazing features and improving the
                  app.
                </p>

                <div className="bg-muted neo-border p-4">
                  <p className="text-sm font-mono text-center">
                    Every coffee fuels creativity and development!
                  </p>
                </div>

                {/* Button */}
                <motion.button
                  onClick={handleBuyClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-secondary text-secondary-foreground font-bold py-3 px-4 neo-border neo-shadow hover:bg-secondary/90 transition-colors"
                >
                  <Coffee className="w-5 h-5 inline mr-2" />
                  Support on Buy Me a Coffee
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
