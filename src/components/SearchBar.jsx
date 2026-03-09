import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const SearchBar = () => {
  const { store } = useGlobalReducer();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const allItems = [
    ...store.people.map((p) => ({ uid: p.uid, name: p.name, type: "people" })),
    ...store.vehicles.map((v) => ({ uid: v.uid, name: v.name, type: "vehicles" })),
    ...store.planets.map((p) => ({ uid: p.uid, name: p.name, type: "planets" })),
  ];

  const results = query.trim().length > 1
    ? allItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setQuery("");
    setOpen(false);
    navigate(`/${item.type}/${item.uid}`);
  };

  const typeLabel = { people: "Character", vehicles: "Vehicle", planets: "Planet" };

  return (
    <div className="sw-search-wrapper" ref={wrapperRef} style={{ width: "260px" }}>
      <input
        type="text"
        className="form-control sw-search-input"
        placeholder="Search characters, planets..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && results.length > 0 && (
        <div className="sw-autocomplete">
          {results.map((item) => (
            <div
              key={`${item.type}-${item.uid}`}
              className="sw-autocomplete-item"
              onMouseDown={() => handleSelect(item)}
            >
              <span className="sw-autocomplete-type">{typeLabel[item.type]}</span>
              <span style={{ fontSize: "0.85rem" }}>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
