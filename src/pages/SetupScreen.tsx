import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

export default function SetupScreen() {
  const { familyData, saveSetup } = useApp();
  const navigate = useNavigate();
  const [childAge, setChildAge] = useState(familyData?.childAge?.toString() || "");
  const [fatherAge, setFatherAge] = useState(familyData?.fatherAge?.toString() || "");
  const [name, setName] = useState(familyData?.fatherName || "");

  const ca = parseInt(childAge);
  const fa = parseInt(fatherAge);
  const targetYear = ca && fa ? new Date().getFullYear() - fa + ca : null;

  const start = async () => {
    if (!ca || !fa) { toast("年齢を入力してください"); return; }
    await saveSetup(ca, fa, name || "お父さん");
    navigate("/game");
  };

  return (
    <div className="screen active" id="screen-setup">
      <div className="setup-container">
        <div className="screen-header">
          <span className="step-label">Step 03 — Setup</span>
          <h2 className="screen-title">まず、あなたと<br />お父さんの情報を。</h2>
        </div>

        <div className="form-group">
          <label className="form-label">あなたの今の年齢</label>
          <input type="number" className="form-input" placeholder="例：18" min={10} max={40} value={childAge} onChange={(e) => setChildAge(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">お父さんの名前（呼び方でOK）</label>
          <input type="text" className="form-input" placeholder="例：お父さん、パパ、田中さん" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">お父さんの現在の年齢</label>
          <input type="number" className="form-input" placeholder="例：50" min={30} max={80} value={fatherAge} onChange={(e) => setFatherAge(e.target.value)} />
          {ca && fa ? (
            <div className="age-display">
              <div className="age-badge" style={{ display: "block" }}>{ca}歳</div>
              <div className="age-description" style={{ display: "block" }}>
                お父さんが{ca}歳だったのは{targetYear}年頃。あなたと同い年の頃。
              </div>
            </div>
          ) : null}
        </div>

        <button className="btn-primary" onClick={start} style={{ width: "100%" }}>
          <span>カードを引く →</span>
        </button>
      </div>
    </div>
  );
}
