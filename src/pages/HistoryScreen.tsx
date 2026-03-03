import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

export default function HistoryScreen() {
  const { fatherName, loadHistory } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory().then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const years = Object.keys(data).sort().reverse();

  return (
    <div className="screen active" id="screen-history">
      <div className="history-content">
        <div className="screen-header" style={{ textAlign: "center" }}>
          <span className="step-label">Archive</span>
          <h2 className="screen-title">これまでの記録。</h2>
        </div>
        {loading ? (
          <><div className="spinner" /><p className="loading-text">履歴を読み込み中...</p></>
        ) : years.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", padding: 40 }}>まだ履歴がありません</p>
        ) : (
          years.map((year) => (
            <div className="history-year" key={year}>
              <div className="history-year-label">{year}年の記録</div>
              {data[year].map((d, i) => {
                const parts: string[] = [];
                if (d.father) parts.push(`${fatherName}: ${d.father.text}`);
                if (d.child) parts.push(`あなた: ${d.child.text}`);
                return (
                  <div className="history-item" key={i}>
                    <div className="history-q">{d.cardType} — {d.question}</div>
                    <div className="history-a">{parts.length ? parts.join(" / ") : "回答なし"}</div>
                  </div>
                );
              })}
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
