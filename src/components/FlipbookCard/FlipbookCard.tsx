"use client";

import { motion } from "framer-motion";
import styles from "./FlipbookCard.module.css";

export default function FlipbookCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}>
      {children}
    </motion.div>
  );
}
