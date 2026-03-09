import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getImageUrl } from "../utils/images";

export const EntityCard = ({ uid, name, type }) => {
  const { store, dispatch } = useGlobalReducer();
  const isFav = store.favorites.some((f) => f.uid === uid && f.type === type);

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "toggle_favorite", payload: { uid, type, name } });
  };

  const icon = type === "people" ? "👤" : type === "vehicles" ? "🚀" : "🪐";

  return (
    <div className="sw-card">
      <Link to={`/${type}/${uid}`} className="text-decoration-none d-flex flex-column h-100">
        <div className="sw-card-img-wrap">
          <img
            src={getImageUrl(type, uid)}
            alt={name}
            className="sw-card-img"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling.style.display = "flex";
            }}
          />
          <div className="sw-card-img-placeholder" style={{ display: "none" }}>
            {icon}
          </div>
        </div>
        <div className="sw-card-name">{name}</div>
      </Link>
      <div className="sw-card-footer">
        <Link to={`/${type}/${uid}`} className="sw-databank-link">
          <span className="sw-databank-dot" />
          Databank
        </Link>
        <button
          className={`sw-fav-btn ${isFav ? "active" : ""}`}
          onClick={toggleFav}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          {isFav ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
};
