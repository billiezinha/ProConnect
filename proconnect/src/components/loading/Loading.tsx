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

export function LoadingProfile() {
  return (
    <div className={styles.profileContainer}>
      {/* Skeleton da Barra Lateral (Foto e Nome) */}
      <div className={styles.sidebarSkeleton}>
        <div className={`${styles.avatarSkeleton} ${styles.skeletonBase}`}></div>
        <div className={`${styles.textSkeleton} ${styles.skeletonBase}`} style={{ width: "80%", height: "24px" }}></div>
        <div className={`${styles.textSkeleton} ${styles.skeletonBase}`} style={{ width: "60%" }}></div>
        <div className={`${styles.buttonSkeleton} ${styles.skeletonBase}`}></div>
      </div>

      {/* Skeleton do Conteúdo Principal */}
      <div className={styles.contentSkeleton}>
        <div className={`${styles.cardSkeleton} ${styles.skeletonBase}`}></div>
        <div className={styles.actionsGrid}>
           <div className={`${styles.actionBox} ${styles.skeletonBase}`}></div>
           <div className={`${styles.actionBox} ${styles.skeletonBase}`}></div>
        </div>
      </div>
    </div>
  );
}