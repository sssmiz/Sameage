import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="screen active" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem", color: "var(--brown)" }}>404</h1>
        <p style={{ fontSize: "1.2rem", color: "var(--brown)", opacity: 0.7, marginBottom: "1.5rem" }}>ページが見つかりません</p>
        <a href="/" className="btn-primary" style={{ textDecoration: "none" }}>
          <span>トップへ戻る</span>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
