export const EVENT_TYPES = ["Donation", "Cleanup", "Plantation", "Winter Relief", "Food Drive", "Health Camp", "Education"];
const COLORS = { Donation: "text-pink-600", Cleanup: "text-emerald-600", Plantation: "text-green-700", "Winter Relief": "text-sky-600", "Food Drive": "text-orange-600", "Health Camp": "text-blue-600", Education: "text-amber-600" };
export const typeColor = (t) => COLORS[t] || "text-teal-700";
const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;
export const unsplash = U;
export const PHOTO_PRESETS = [
  ["Winter Clothes", U("photo-1593113598332-cd288d649433")],
  ["Blanket", U("photo-1532629345422-7515f3d16bb6")],
  ["Cleanup", U("photo-1618477461853-cf6ed80faba5")],
  ["Tree Plantation", U("photo-1542601906990-b4d3fb778b09")],
];
