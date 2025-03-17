import React from "react";
import styles from "./SpecRow.module.css";

export const SpecRow = ({ label, value }) => (
  <div className={styles.row}>
    <div className={styles.label}>{label}:</div>
    <span className={styles.value}>{value}</span>
  </div>
);
