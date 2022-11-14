import React from "react";
import styles from "./backPrePage.module.css";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export function BackPrePage() {
  const navigate = useNavigate();

  const backToPrePage = () => {
    navigate(-1);
  };

  return (
    <div className={styles["back"]} onClick={backToPrePage}>
      <LeftOutlined /> 返回
    </div>
  );
}
