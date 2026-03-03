import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { cardTemplates } from "@/lib/cardTemplates";

interface LocalAnswer {
  who: string | null;
  text: string;
  cardType: string;
}

export default function GameScreen() {
  const { fatherName, targetAge, userRole, saveAnswer } = useApp();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selectedWho, setSelectedWho] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [flipping, setFlipping] = useState(false);
  const [answers, setAnswers] = useState<LocalAnswer[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const card = cardTemplates[current];
  const question = card.question.replace(/{{age}}/g, String(targetAge));

  const next = async () => {
    const who = selectedWho || userRole || "unknown";
    const text = answerText.trim();

    setAnswers((prev) => [...prev, { who, text, cardType: card.type }]);
    if (text) {
      saveAnswer(current, card.type, question, who, text);
    }

    setFlipping(true);
    setTimeout(() => {
      const nextIdx = current + 1;
      if (nextIdx >= cardTemplates.length) {
        navigate("/end", { state: { answers: [...answers, { who, text, cardType: card.type }] } });
        return;
      }
      setCurrent(nextIdx);
      setSelectedWho(null);
      setAnswerText("");
      setFlipping(false);
    }, 400);
  };

  return (
    <div className="screen active" id="screen-game">
      <div className="game-header">
        <div className="game-logo">SAME AGE</div>
        <div className="progress-area">
          <span className="progress-text">{current + 1} / {cardTemplates.length}</span>
          <div className="progress-dots">
            {cardTemplates.map((_, i) => (
              <div key={i} className={`dot ${i < current ? "done" : i === current ? "active" : ""}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="game-main">
        <div className="card-stack">
          <div className="card-bg-2" />
          <div className="card-bg" />
          <div ref={cardRef} className={`card ${flipping ? "flip-out" : ""}`}>
            <div className="card-corner">
              <span className="card-type">{card.type}</span>
              <span className="card-number">{String(current + 1).padStart(2, "0")}</span>
            </div>
            <div className="card-age-context">{fatherName}が {targetAge}歳のとき</div>
            <div className="card-question">{question}</div>
            <div className="card-divider" />
            <div className="card-hint">{card.hint}</div>
          </div>
        </div>

        <div className="answer-section">
          <div className="who-answers">
            <button className={`who-btn ${selectedWho === "father" ? "selected" : ""}`} onClick={() => setSelectedWho("father")}>
              👨 お父さんが答える
            </button>
            <button className={`who-btn ${selectedWho === "child" ? "selected" : ""}`} onClick={() => setSelectedWho("child")}>
              🙋 自分も答える
            </button>
          </div>
          <textarea
            className="answer-textarea"
            placeholder={selectedWho === "father" ? `${fatherName}の答えを書いてあげよう…` : "答えをここに書く（スキップもOK）"}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
          />
          <button className="btn-next" onClick={next}>次のカードへ →</button>
        </div>
      </div>
    </div>
  );
}
