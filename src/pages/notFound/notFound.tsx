import React from "react";
import styles from "./notFound.module.less";
import NF from "../../assets/notFound/NF.png";
 const NotFound: React.FC = () => {
  return (
    <div className={styles.center}>
      <img src={NF} alt='404'/>
      <h3>您的页面已丢失</h3>
    </div>
  );
};
export default NotFound;
