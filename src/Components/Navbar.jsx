import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  useEffect(() => {
    console.log("Current route:", location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          WritePad
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                Home
              </Link>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/notes" ? "active" : ""
                    }`}
                    to="/notes"
                  >
                    My Notes
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/add-note" ? "active" : ""
                    }`}
                    to="/add-note"
                  >
                    + New Note
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/about" ? "active" : ""
                }`}
                to="/about"
              >
                About
              </Link>
            </li>
          </ul>

          <div className="d-flex me-3">
            {!isLoggedIn ? (
              <>
                <Link
                  className={`btn btn-outline-primary me-2 ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  to="/"
                >
                  Login
                </Link>

                <Link
                  className={`btn btn-primary ${
                    location.pathname === "/register" ? "active" : ""
                  }`}
                  to="/register"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

