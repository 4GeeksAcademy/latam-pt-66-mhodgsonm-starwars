const BASE = "https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img";

const typeMap = {
  people: "characters",
  vehicles: "vehicles",
  planets: "planets",
};

export const getImageUrl = (type, uid) => {
  const folder = typeMap[type];
  return `${BASE}/${folder}/${uid}.jpg`;
};
