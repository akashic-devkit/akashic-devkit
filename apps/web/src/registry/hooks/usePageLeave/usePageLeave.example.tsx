import { useEffect, useState } from "react";
import usePageLeave from "./usePageLeave";

export default function UsePageLeaveExample() {
  const [lastLeaveTime, setLastLeaveTime] = useState<string | null>(null);

  // 컴포넌트 마운트 시 마지막 이탈 시간 불러오기
  useEffect(() => {
    const savedTime = localStorage.getItem("lastLeaveTime");
    setLastLeaveTime(savedTime);
  }, []);

  // 페이지 이탈 시 localStorage에 시간 저장
  usePageLeave({
    callback: () => {
      const now = new Date().toISOString();
      localStorage.setItem("lastLeaveTime", now);
      console.log("Page leave time saved:", now);
    },
  });

  return (
    <div>
      <div>
        Last Leave Time:
        <strong style={{ marginLeft: "8px" }}>
          {lastLeaveTime ? new Date(lastLeaveTime).toLocaleString() : "None"}
        </strong>
      </div>
      <p style={{ marginTop: "16px", color: "#666", fontSize: "14px" }}>
        페이지를 떠나면 이탈 시간이 localStorage에 저장됩니다.
      </p>
    </div>
  );
}
