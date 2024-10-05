import '../styles/Navbar.css';
import { Link } from 'react-router-dom';

export function Navbar({ isLoggedIn, handleAuth }) {
  return (
    <>
      <nav>
        <h1>ICP GenGen</h1>
        <div className="links">
          <button onClick={handleAuth}>
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
          <Link to={'/'}>Home</Link>
          <Link to={'/generator'}>Generator</Link>
          <Link to={'/mystock'}>My Stock</Link>
          <Link to={'/explore'}>Explore</Link>
        </div>
      </nav>
    </>
  );
}
