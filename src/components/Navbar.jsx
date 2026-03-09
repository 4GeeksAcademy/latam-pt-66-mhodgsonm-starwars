import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { SearchBar } from "./SearchBar";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const [favOpen, setFavOpen] = useState(false);
  const favRef  = useRef(null);
  const navigate = useNavigate();

  const { favorites } = store;

  useEffect(() => {
    const handler = (e) => {
      if (favRef.current && !favRef.current.contains(e.target)) setFavOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const typeLabel = { people: "Character", vehicles: "Vehicle", planets: "Planet" };

  return (
    <nav className="navbar sw-navbar">
      <div className="container-fluid d-flex align-items-center gap-3">
        <Link to="/" className="sw-brand me-3">Star Wars</Link>

        <SearchBar />

        <div className="flex-grow-1" />

        {/* Favorites */}
        <div className="position-relative" ref={favRef}>
          <button
            className="sw-fav-toggle"
            onClick={() => setFavOpen((o) => !o)}
          >
            Favorites
            {favorites.length > 0 && (
              <span className="sw-fav-count">{favorites.length}</span>
            )}
          </button>

          {favOpen && (
            <div className="sw-fav-menu">
              {favorites.length === 0 ? (
                <div className="sw-fav-empty">No favorites yet</div>
              ) : (
                favorites.map((fav) => (
                  <div
                    key={`${fav.type}-${fav.uid}`}
                    className="sw-fav-menu-item"
                    onClick={() => {
                      setFavOpen(false);
                      navigate(`/${fav.type}/${fav.uid}`);
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 flex-grow-1 overflow-hidden">
                      <span className="sw-fav-type-badge">{typeLabel[fav.type]}</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {fav.name}
                      </span>
                    </div>
                    <button
                      className="sw-fav-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: "toggle_favorite", payload: fav });
                      }}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
