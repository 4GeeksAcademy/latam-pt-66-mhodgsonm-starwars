import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { EntityCard } from "../components/EntityCard";

const SWAPI = "https://www.swapi.tech/api";
const PAGE_SIZE = 12;

const sidebarItems = [
  { key: "all",       label: "All",          available: true  },
  { key: "people",    label: "Characters",   available: true  },
  { key: "creatures", label: "Creatures",    available: false },
  { key: "droids",    label: "Droids",       available: false },
  { key: "locations", label: "Locations",    available: false },
  { key: "orgs",      label: "Organizations",available: false },
  { key: "species",   label: "Species",      available: false },
  { key: "vehicles",  label: "Vehicles",     available: true  },
  { key: "weapons",   label: "Weapons+Tech", available: false },
  { key: "planets",   label: "Planets",      available: true  },
];

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [active, setActive]   = useState("people");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState({ people: false, vehicles: false, planets: false });

  const fetchEntities = async (type) => {
    if (store[`${type}Loaded`]) return;
    setLoading((l) => ({ ...l, [type]: true }));
    try {
      const res  = await fetch(`${SWAPI}/${type}?page=1&limit=60`);
      const data = await res.json();
      const results = data.results.map((r) => ({ uid: r.uid, name: r.name }));
      dispatch({ type: `set_${type}`, payload: results });
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
    } finally {
      setLoading((l) => ({ ...l, [type]: false }));
    }
  };

  useEffect(() => {
    fetchEntities("people");
    fetchEntities("vehicles");
    fetchEntities("planets");
  }, []);

  const handleCategory = (key) => {
    setActive(key);
    setVisible(PAGE_SIZE);
  };

  const getItems = () => {
    if (active === "all") {
      return [
        ...store.people.map((i) => ({ ...i, type: "people" })),
        ...store.vehicles.map((i) => ({ ...i, type: "vehicles" })),
        ...store.planets.map((i) => ({ ...i, type: "planets" })),
      ];
    }
    return (store[active] || []).map((i) => ({ ...i, type: active }));
  };

  const allItems    = getItems();
  const shownItems  = allItems.slice(0, visible);
  const hasMore     = visible < allItems.length;
  const isLoading   = active !== "all"
    ? loading[active]
    : loading.people || loading.vehicles || loading.planets;

  return (
    <div>
      {/* Page heading */}
      <h2 className="sw-page-title">
        Browse Databank <span>//</span>
      </h2>

      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {/* Sidebar */}
        <nav className="sw-sidebar">
          <div className="sw-sidebar-label">Browse</div>
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={`sw-sidebar-item ${!item.available ? "disabled" : ""} ${active === item.key ? "active" : ""}`}
              onClick={() => item.available && handleCategory(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Main grid */}
        <div className="sw-main">
          {isLoading ? (
            <div className="sw-spinner-wrap">
              <div className="sw-spinner" />
              <span className="sw-spinner-text">Loading</span>
            </div>
          ) : (
            <>
              <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3">
                {shownItems.map((item) => (
                  <div key={`${item.type}-${item.uid}`} className="col">
                    <EntityCard uid={item.uid} name={item.name} type={item.type} />
                  </div>
                ))}
              </div>
              {hasMore && (
                <button
                  className="sw-show-more"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                >
                  Show More
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
