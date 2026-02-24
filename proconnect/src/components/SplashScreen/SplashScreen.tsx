"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./SplashScreen.module.css";

export default function SplashScreen({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.container}
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
        >
          {/* Brilho de fundo pulsante */}
          <motion.div 
            className={styles.glow}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className={styles.logoWrapper}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ 
                scale: 1.5, 
                opacity: 0, 
                filter: "blur(20px)",
                transition: { duration: 0.5 } 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20,
                duration: 1 
              }}
            >
              <Image 
                src="/logo.png" 
                alt="Logo ProConnect" 
                width={280} 
                height={280} 
                priority 
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}