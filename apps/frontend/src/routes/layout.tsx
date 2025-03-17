import { Link, Outlet } from 'react-router-dom';

// This will be the SharedLayout that contains Header and Footer components
export function Layout() {
  return (
    <>
      <header style={{ backgroundColor: '#f8f8f8', padding: '20px' }}>
        {/* Header will contain Logo, Nav, AuthBar or UserBar */}
        <div className="header-container">
          <div className="logo">Foodies</div>
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/recipe/add">Add Recipe</Link>
              </li>
              <li>
                <Link to="/user/profile">My Profile</Link>
              </li>
              {/* These links are placeholders. In a real app, you'd use actual IDs */}
              <li>
                <Link to="/recipe/example-id">Recipe Example</Link>
              </li>
              <li>
                <Link to="/user/example-id">User Example</Link>
              </li>
            </ul>
          </nav>
          <div className="auth-controls">
            <button>Sign In</button>
            <button>Sign Up</button>
          </div>
        </div>
      </header>

      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>

      <footer style={{ backgroundColor: '#f8f8f8', padding: '20px' }}>
        {/* Footer will contain Logo, NetworkLinks, Copyright */}
        <div className="footer-container">
          <div className="logo">Foodies</div>
          <div className="social-links">
            <ul>
              <li>
                <a
                  href="https://www.facebook.com/goITclub/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/goitclub/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/c/GoIT"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
          <div className="copyright">@2024, Foodies. All rights reserved</div>
        </div>
      </footer>
    </>
  );
}
