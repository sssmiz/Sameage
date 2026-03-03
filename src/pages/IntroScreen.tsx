import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function IntroScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen active" id="screen-intro">
      <div className="intro-bg" />
      <motion.div
        className="intro-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="logo-mark">
          <div className="logo-ring" />
          <div className="logo-inner">
            <span className="logo-text-small">SA</span>
          </div>
        </div>
        <p className="tagline">Father's Day Experience</p>
        <h1 className="main-title">SAME<br />AGE</h1>
        <p className="main-subtitle">父が、あなたと同じ年齢だった頃。</p>
        <p className="intro-description">
          父のことを、私たちはどれほど知っているだろう。<br />
          同じ年齢だった頃の父は、何を考え、何に悩んでいたのか。<br />
          今日だけ、父と「同い年」として話してみよう。
        </p>
        <button className="btn-primary" onClick={() => navigate("/login")}>
          <span>はじめる →</span>
        </button>
        <p className="father-age-note">父の日 2026.6.21</p>
      </motion.div>
    </div>
  );
}
