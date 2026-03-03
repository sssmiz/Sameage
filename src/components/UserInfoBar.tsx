import { useApp } from "@/contexts/AppContext";

export default function UserInfoBar() {
  const { currentUser, logout } = useApp();
  if (!currentUser) return null;

  return (
    <div className="user-info-bar visible">
      <div className="user-name">
        {currentUser.photoURL && (
          <img className="user-avatar" src={currentUser.photoURL} alt="" />
        )}
        <span>{currentUser.displayName || "ユーザー"}</span>
      </div>
      <button className="btn-logout" onClick={logout}>ログアウト</button>
    </div>
  );
}
