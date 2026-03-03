import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

interface LocalAnswer {
  who: string;
  text: string;
  cardType: string;
}

export default function EndScreen() {
  const { fatherName } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const answers: LocalAnswer[] = (location.state as { answers?: LocalAnswer[] })?.answers || [];

  return (
    <div className="screen active" id="screen-end">
      <div className="end-content">
        <div className="end-icon">🌿</div>
        <h2 className="end-title">今日、父を<br />少し知れた。</h2>
        <p className="end-message">
          気まずくて言えなかった言葉は、<br />
          カードが代わりに引き出してくれた。<br />
          来年の父の日も、続きを話そう。
        </p>

        <div className="answers-recap">
          <p className="recap-title">今日の記録</p>
          {answers.filter((a) => a.text).length === 0 ? (
            <p style={{ color: "#aaa", fontSize: 13 }}>記録なし（スキップされました）</p>
          ) : (
            answers.filter((a) => a.text).map((a, i) => (
              <div className="recap-item" key={i}>
                <div className="recap-who">{a.who === "father" ? fatherName : "あなた"}</div>
                <div className="recap-q">{a.cardType}</div>
                <div className="recap-a">{a.text}</div>
              </div>
            ))
          )}
        </div>

        <div className="next-year-note">
          📅 <strong>来年の父の日（{new Date().getFullYear() + 1}年6月）</strong>、アプリが「お父さんの〇歳のカード」を新たに届けます。毎年、まだ知らない父に出会い続けよう。
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-restart" onClick={() => navigate("/compare")}>🔄 回答を比較する</button>
          <button className="btn-restart" onClick={() => navigate("/history")}>📜 過去の記録を見る</button>
          <button className="btn-restart" onClick={() => navigate("/")}>最初からやり直す</button>
        </div>
      </div>
    </div>
  );
}
