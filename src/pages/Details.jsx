import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getImageUrl } from "../utils/images";

const SWAPI = "https://www.swapi.tech/api";

// Ordered stat columns per type — mirrors the screenshot layout
const PEOPLE_STATS = [
  { key: "films",      label: "Appearances" },
  { key: "affiliations", label: "Affiliations", fallback: true },
  { key: "homeworld",  label: "Locations", isUrl: true },
  { key: "gender",     label: "Gender" },
  { key: "height",     label: "Dimensions", format: (v) => `Height: ${v}` },
  { key: "species",    label: "Species" },
  { key: "vehicles",   label: "Vehicles" },
  { key: "starships",  label: "Starships" },
];

const VEHICLE_STATS = [
  { key: "model",            label: "Model" },
  { key: "vehicle_class",    label: "Class" },
  { key: "manufacturer",     label: "Manufacturer" },
  { key: "crew",             label: "Crew" },
  { key: "passengers",       label: "Passengers" },
  { key: "max_atmosphering_speed", label: "Max Speed" },
  { key: "length",           label: "Length" },
  { key: "cost_in_credits",  label: "Cost (Credits)" },
  { key: "cargo_capacity",   label: "Cargo Capacity" },
  { key: "consumables",      label: "Consumables" },
  { key: "films",            label: "Appearances" },
];

const PLANET_STATS = [
  { key: "climate",          label: "Climate" },
  { key: "terrain",          label: "Terrain" },
  { key: "population",       label: "Population" },
  { key: "diameter",         label: "Diameter" },
  { key: "gravity",          label: "Gravity" },
  { key: "rotation_period",  label: "Rotation Period" },
  { key: "orbital_period",   label: "Orbital Period" },
  { key: "surface_water",    label: "Surface Water" },
  { key: "films",            label: "Appearances" },
  { key: "residents",        label: "Residents" },
];

const STATS_MAP = {
  people:   PEOPLE_STATS,
  vehicles: VEHICLE_STATS,
  planets:  PLANET_STATS,
};

const extractId = (url) => url?.match(/\/(\d+)\/?$/)?.[1];

const formatValue = (val, key, type) => {
  if (!val || val === "n/a" || val === "unknown" || val === "none") return null;

  if (Array.isArray(val)) {
    if (val.length === 0) return null;
    return val.map((v, i) => {
      if (typeof v === "string" && v.startsWith("http")) {
        const id = extractId(v);
        return id ? `#${id}` : `item ${i + 1}`;
      }
      return v;
    }).join(", ");
  }

  if (typeof val === "string" && val.startsWith("http")) {
    const id = extractId(val);
    return id ? `Planet #${id}` : val;
  }

  return val;
};

export const Details = ({ type }) => {
  const { uid } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [entity, setEntity]   = useState(null);
  const [desc, setDesc]       = useState("");
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const isFav = store.favorites.some((f) => f.uid === uid && f.type === type);

  useEffect(() => {
    setEntity(null);
    setDesc("");
    setLoading(true);
    setImgError(false);

    fetch(`${SWAPI}/${type}/${uid}`)
      .then((r) => r.json())
      .then((data) => {
        setEntity(data.result.properties);
        setDesc(data.result.description || "");
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [type, uid]);

  if (loading) {
    return (
      <div className="sw-spinner-wrap" style={{ minHeight: "60vh" }}>
        <div className="sw-spinner" />
        <span className="sw-spinner-text">Loading</span>
      </div>
    );
  }

  if (!entity) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h2 style={{ color: "#ffe81f" }}>Not Found</h2>
        <Link to="/" className="sw-back-link" style={{ justifyContent: "center", width: "auto" }}>
          ← Back
        </Link>
      </div>
    );
  }

  const icon   = type === "people" ? "👤" : type === "vehicles" ? "🚀" : "🪐";
  const stats  = STATS_MAP[type] || [];

  const statCols = stats
    .map((s) => {
      const raw = entity[s.key];
      const val = s.format ? s.format(raw) : formatValue(raw, s.key, type);
      return val ? { label: s.label, value: val } : null;
    })
    .filter(Boolean);

  return (
    <div>
      {/* Back link */}
      <Link to="/" className="sw-back-link">
        ← Back to Databank
      </Link>

      {/* Top section: image + info */}
      <div className="sw-details-top">
        {/* Image */}
        <div className="sw-details-img-col">
          {imgError ? (
            <div className="sw-details-img-placeholder">{icon}</div>
          ) : (
            <img
              src={getImageUrl(type, uid)}
              alt={entity.name}
              className="sw-details-img"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Info */}
        <div className="sw-details-info-col">
          <h1 className="sw-details-name">{entity.name}</h1>

          {desc && (
            <p className="sw-details-description">{desc}</p>
          )}

          <button
            className={`sw-details-fav-btn ${isFav ? "active" : ""}`}
            onClick={() =>
              dispatch({
                type: "toggle_favorite",
                payload: { uid, type, name: entity.name },
              })
            }
          >
            {isFav ? "★ Remove Favorite" : "☆ Add to Favorites"}
          </button>
        </div>
      </div>

      {/* Bottom stats row */}
      {statCols.length > 0 && (
        <div className="sw-details-stats">
          {statCols.map((col) => (
            <div key={col.label} className="sw-stat-col">
              <div className="sw-stat-label">{col.label}</div>
              <div className="sw-stat-value">{col.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
