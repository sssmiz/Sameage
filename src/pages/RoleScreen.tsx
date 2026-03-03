import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

export default function RoleScreen() {
  const { setUserRole } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const confirm = () => {
    if (!selected) { toast("役割を選んでください"); return; }
    setUserRole(selected);
    navigate("/pairing");
  };

  return (
    <div className="screen active" id="screen-role">
      <div className="role-content">
        <div className="screen-header" style={{ textAlign: "center" }}>
          <span className="step-label">Step 01 — Role</span>
          <h2 className="screen-title">あなたは<br />どちらですか？</h2>
        </div>
        <div className="role-cards">
          <div className={`role-card ${selected === "father" ? "selected" : ""}`} onClick={() => setSelected("father")}>
            <div className="role-icon">👨</div>
            <div className="role-label">父親</div>
            <div className="role-desc">子供の頃の記憶を<br />思い出して答えよう</div>
          </div>
          <div className={`role-card ${selected === "child" ? "selected" : ""}`} onClick={() => setSelected("child")}>
            <div className="role-icon">🙋</div>
            <div className="role-label">子供</div>
            <div className="role-desc">お父さんと同じ質問に<br />自分も答えてみよう</div>
          </div>
        </div>
        <button className="btn-primary" onClick={confirm} style={{ width: "100%" }}>
          <span>次へ →</span>
        </button>
      </div>
    </div>
  );
}
