import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  username?: string;
}

export default function Navbar({ username }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav>
      <div className="nav-content">
        <h1>Mini Project Manager</h1>
        {username && (
          <div className="nav-right">
            <span>Welcome, {username}</span>
            <button onClick={handleLogout} className="btn btn-red">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
