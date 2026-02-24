"use client";
import styles from "./Loading.module.css";

export function LoadingCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.skeletonText}></div>
      <div className={styles.skeletonTextSmall}></div>
      <div className={styles.skeletonFooter}></div>
    </div>
  );
}

export function LoadingGrid() {
  return (
    <div className={styles.loadingGrid}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}