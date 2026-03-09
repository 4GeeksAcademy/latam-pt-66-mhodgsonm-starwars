const STORAGE_KEY = "starwars_store";

export const initialStore = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fall through to default
    }
  }
  return {
    people: [],
    vehicles: [],
    planets: [],
    favorites: [],
    peopleLoaded: false,
    vehiclesLoaded: false,
    planetsLoaded: false,
  };
};

const saveToStorage = (store) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export default function storeReducer(store, action = {}) {
  let next;
  switch (action.type) {
    case "set_people":
      next = { ...store, people: action.payload, peopleLoaded: true };
      saveToStorage(next);
      return next;
    case "set_vehicles":
      next = { ...store, vehicles: action.payload, vehiclesLoaded: true };
      saveToStorage(next);
      return next;
    case "set_planets":
      next = { ...store, planets: action.payload, planetsLoaded: true };
      saveToStorage(next);
      return next;
    case "toggle_favorite": {
      const { uid, type, name } = action.payload;
      const exists = store.favorites.some(
        (f) => f.uid === uid && f.type === type
      );
      const favorites = exists
        ? store.favorites.filter((f) => !(f.uid === uid && f.type === type))
        : [...store.favorites, { uid, type, name }];
      next = { ...store, favorites };
      saveToStorage(next);
      return next;
    }
    default:
      throw Error("Unknown action: " + action.type);
  }
}
