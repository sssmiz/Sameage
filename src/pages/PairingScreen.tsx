import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

export default function PairingScreen() {
  const { userRole, createFamily, joinFamily } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState(userRole === "father" ? "create" : "join");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const code = await createFamily();
      setGeneratedCode(code);
      toast.success("家族コードを作成しました！");
    } catch {
      toast.error("作成に失敗しました");
    }
    setCreating(false);
  };

  const handleJoin = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code || code.length !== 6) { toast("6桁のコードを入力してください"); return; }
    const ok = await joinFamily(code);
    if (ok) {
      toast.success("家族に参加しました！");
      navigate("/setup");
    }
  };

  return (
    <div className="screen active" id="screen-pairing">
      <div className="pairing-content">
        <div className="screen-header" style={{ textAlign: "center" }}>
          <span className="step-label">Step 02 — Pairing</span>
          <h2 className="screen-title">家族を<br />つなげよう。</h2>
        </div>

        <div className="pairing-tabs">
          <button className={`pairing-tab ${tab === "create" ? "active" : ""}`} onClick={() => setTab("create")}>コードを作成</button>
          <button className={`pairing-tab ${tab === "join" ? "active" : ""}`} onClick={() => setTab("join")}>コードで参加</button>
        </div>

        {tab === "create" && (
          <div className="pairing-section active">
            {!generatedCode ? (
              <>
                <p className="code-instruction">
                  ボタンを押すと家族コードが作成されます。<br />このコードを家族に伝えてください。
                </p>
                <button className="btn-primary" onClick={handleCreate} disabled={creating} style={{ width: "100%", marginBottom: 24 }}>
                  <span>{creating ? "作成中..." : "家族コードを作成"}</span>
                </button>
              </>
            ) : (
              <>
                <div className="family-code-display">{generatedCode}</div>
                <p className="code-instruction">このコードを家族に伝えてください。<br />家族がこのコードを入力すると、回答がリンクされます。</p>
                <button className="btn-primary" onClick={() => navigate("/setup")} style={{ width: "100%" }}>
                  <span>セットアップへ進む →</span>
                </button>
              </>
            )}
          </div>
        )}

        {tab === "join" && (
          <div className="pairing-section active">
            <p className="code-instruction">家族から受け取った6桁のコードを入力してください。</p>
            <input
              type="text"
              className="code-input"
              placeholder="A B C 1 2 3"
              maxLength={6}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            />
            <button className="btn-primary" onClick={handleJoin} style={{ width: "100%" }}>
              <span>参加する</span>
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            style={{ background: "none", border: "none", color: "var(--brown)", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/setup")}
          >
            ペアリングをスキップして一人で始める
          </button>
        </div>
      </div>
    </div>
  );
}
