import { useContext } from "react";
import { UserContext } from "./UserContext";
import './App.css';

/**
 * Profile — shown in the sidebar as a mini user card.
 * Full user data comes from UserContext (fetched on app load).
 * No separate API call needed here.
 */
function Profile() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  function logoutUser() {
    const url = import.meta.env.VITE_API_URL + '/logout';
    fetch(url, { method: 'POST', credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          setUserInfo(null);
        }
      });
  }

  if (!userInfo || !userInfo.email) {
    return null; // Layout handles redirect via ProtectedRoute
  }

  return (
    <div className="card profile-card">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem'
        }}>
          {userInfo.email.charAt(0).toUpperCase()}
        </div>
        <div style={{ fontWeight: 500, fontSize: '0.95rem', wordBreak: 'break-word', textAlign: 'center' }}>
          {userInfo.email}
        </div>
        <button
          className="action-button profile-logout-btn"
          style={{ width: '100%', fontSize: '0.95rem', padding: '0.4rem 0.5rem' }}
          onClick={logoutUser}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
