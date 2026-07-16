"use client";

import { motion } from "framer-motion";

export default function HUDPanel({
  children,
  variant = "cyan",
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  variant?: "cyan" | "crimson";
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`glass ${
        variant === "crimson" ? "glass-crimson" : ""
      } rounded-2xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
