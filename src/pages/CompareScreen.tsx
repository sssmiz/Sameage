import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

interface AnswerData {
  cardType: string;
  question: string;
  targetAge: number;
  father?: { text: string };
  child?: { text: string };
}

export default function CompareScreen() {
  const { fatherName, loadCompareData } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState<AnswerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompareData().then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="screen active" id="screen-compare">
      <div className="compare-content">
        <div className="screen-header" style={{ textAlign: "center" }}>
          <span className="step-label">Comparison</span>
          <h2 className="screen-title">父と子の<br />回答をくらべる。</h2>
        </div>
        {loading ? (
          <><div className="spinner" /><p className="loading-text">回答を読み込み中...</p></>
        ) : data.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", padding: 40 }}>まだ回答がありません</p>
        ) : (
          data.map((d, i) => (
            <div className="compare-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="compare-card-type">{d.cardType}</div>
              <div className="compare-question">{d.question}</div>
              <div className="compare-answers">
                <div className="compare-answer-box">
                  <div className="compare-answer-label">👨 {fatherName}の回答</div>
                  <div className={`compare-answer-text ${!d.father ? "waiting" : ""}`}>{d.father?.text || "まだ回答されていません"}</div>
                </div>
                <div className="compare-answer-box child-answer">
                  <div className="compare-answer-label">🙋 あなたの回答</div>
                  <div className={`compare-answer-text ${!d.child ? "waiting" : ""}`}>{d.child?.text || "まだ回答されていません"}</div>
                </div>
              </div>
            </div>
          ))
        )}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button className="btn-restart" onClick={() => navigate("/end")}>エンディングへ戻る</button>
        </div>
      </div>
    </div>
  );
}
