// Mock catalog data — stands in for GET /api/products in the MERN spec.
// Images are real product photography from Unsplash.
import { shoeImg } from "./shoeImages";

export const categories = [
  { slug: "running", name: "Running" },
  { slug: "sneakers", name: "Sneakers" },
  { slug: "basketball", name: "Basketball" },
  { slug: "formal", name: "Formal" },
  { slug: "casual", name: "Casual" },
  { slug: "boots", name: "Boots" },
];

export const genders = [
  { slug: "men", name: "Men" },
  { slug: "women", name: "Women" },
  { slug: "kids", name: "Kids" },
];

export const brands = ["Ridgeline", "Aeropace", "Norteno", "Vantek", "Coastway", "Marrow"];

const img = (key) => shoeImg(key, 900, 900);
const stockFor = (sizes, base = 6) =>
  Object.fromEntries(sizes.map((s, i) => [s, Math.max(0, base - i - (i % 3 === 0 ? 0 : 2))]));

export const products = [
  // ---------------- MEN ----------------
  {
    id: "p1", slug: "ridgeline-vector-runner", name: "Vector Runner",
    brand: "Ridgeline", category: "running", gender: "men",
    price: 6499, mrp: 8499, rating: 4.6, reviewCount: 214,
    activity: "Running", material: "Mesh", badges: ["bestseller"],
    description: "A lightweight daily trainer built on a rebound foam midsole. Breathable engineered mesh upper keeps feet cool over long distances, and a durable rubber outsole handles road and light trail.",
    images: [img("heroWhite"), img("grayRunner"), img("whiteRed")],
    colors: [
      { name: "Chalk White", hex: "#FFFFFF", image: img("heroWhite"), sizes: [7,8,9,10,11], stock: stockFor([7,8,9,10,11]) },
      { name: "Track Navy", hex: "#0B1B3D", image: img("grayRunner"), sizes: [7,8,9,10,11], stock: stockFor([7,8,9,10,11]) },
      { name: "Traction Orange", hex: "#FF6B1A", image: img("whiteRed"), sizes: [7,8,9,10,11], stock: stockFor([7,8,9,10,11]) },
    ],
  },
  {
    id: "p2", slug: "aeropace-glide-2", name: "Glide 2",
    brand: "Aeropace", category: "running", gender: "men",
    price: 7999, mrp: 7999, rating: 4.4, reviewCount: 132,
    activity: "Running", material: "Knit", badges: ["new"],
    description: "Responsive plate-cushioned ride for tempo runs. A snug knit collar locks the heel while a wide forefoot gives toes room to splay on push-off.",
    images: [img("redSneaker"), img("whiteRed"), img("tealAsphalt")],
    colors: [
      { name: "Cone Orange", hex: "#FF6B1A", image: img("redSneaker"), sizes: [8,9,10,11,12], stock: stockFor([8,9,10,11,12]) },
      { name: "Ink Black", hex: "#14181F", image: img("tealAsphalt"), sizes: [8,9,10,11,12], stock: stockFor([8,9,10,11,12]) },
    ],
  },
  {
    id: "p3", slug: "norteno-court-classic", name: "Court Classic",
    brand: "Norteno", category: "sneakers", gender: "men",
    price: 5299, mrp: 5299, rating: 4.8, reviewCount: 401,
    activity: "Walking", material: "Leather", badges: ["bestseller"],
    description: "The everyday leather sneaker. Full-grain leather upper, cupsole construction and a low-profile silhouette that pairs with anything from denim to tailoring.",
    images: [img("whiteHighTop"), img("blackWhite"), img("whiteOnClothing")],
    colors: [
      { name: "Chalk White", hex: "#FFFFFF", image: img("whiteHighTop"), sizes: [6,7,8,9,10,11], stock: stockFor([6,7,8,9,10,11]) },
      { name: "Ink Black", hex: "#14181F", image: img("blackWhite"), sizes: [6,7,8,9,10,11], stock: stockFor([6,7,8,9,10,11]) },
    ],
  },
  {
    id: "p4", slug: "vantek-airhang", name: "AirHang",
    brand: "Vantek", category: "basketball", gender: "men",
    price: 10999, mrp: 12999, rating: 4.5, reviewCount: 88,
    activity: "Court sports", material: "Synthetic", badges: ["sale"],
    description: "High-top support built for lateral cuts. A visible cushioning unit absorbs landings while an internal harness locks the midfoot for hard stops.",
    images: [img("blackWhite"), img("whiteHighTop"), img("greenBlack")],
    colors: [
      { name: "Track Navy", hex: "#0B1B3D", image: img("greenBlack"), sizes: [8,9,10,11,12,13], stock: stockFor([8,9,10,11,12,13]) },
      { name: "Ink Black", hex: "#14181F", image: img("blackWhite"), sizes: [8,9,10,11,12,13], stock: stockFor([8,9,10,11,12,13]) },
    ],
  },
  {
    id: "p6", slug: "marrow-oxford-01", name: "Oxford 01",
    brand: "Marrow", category: "formal", gender: "men",
    price: 8999, mrp: 8999, rating: 4.7, reviewCount: 63,
    activity: "Formal", material: "Leather", badges: [],
    description: "A cap-toe oxford with a leather sole and Goodyear-inspired welt construction, built to be resoled rather than replaced.",
    images: [img("blackLeather"), img("brownYellow"), img("blackWhite")],
    colors: [
      { name: "Ink Black", hex: "#14181F", image: img("blackLeather"), sizes: [7,8,9,10,11], stock: stockFor([7,8,9,10,11]) },
      { name: "Chestnut Brown", hex: "#7B4B2A", image: img("brownYellow"), sizes: [7,8,9,10,11], stock: stockFor([7,8,9,10,11]) },
    ],
  },
  {
    id: "p7", slug: "ridgeline-summit-boot", name: "Summit Boot",
    brand: "Ridgeline", category: "boots", gender: "men",
    price: 9499, mrp: 10999, rating: 4.6, reviewCount: 145,
    activity: "Hiking", material: "Leather", badges: ["sale"],
    description: "Waterproof full-grain leather upper over a lugged rubber outsole for loose trail and wet rock. Reinforced toe cap, gusseted tongue.",
    images: [img("brownYellow"), img("maroonPlimsoll"), img("blackLeather")],
    colors: [
      { name: "Track Navy", hex: "#0B1B3D", image: img("maroonPlimsoll"), sizes: [7,8,9,10,11,12], stock: stockFor([7,8,9,10,11,12]) },
      { name: "Chestnut Brown", hex: "#7B4B2A", image: img("brownYellow"), sizes: [7,8,9,10,11,12], stock: stockFor([7,8,9,10,11,12]) },
    ],
  },
  {
    id: "p10", slug: "vantek-crossline", name: "Crossline",
    brand: "Vantek", category: "sneakers", gender: "men",
    price: 4599, mrp: 6299, rating: 4.1, reviewCount: 39,
    activity: "Walking", material: "Synthetic", badges: ["sale"],
    description: "A retro-inspired runner silhouette with a padded collar and a two-tone rubber outsole for everyday wear.",
    images: [img("whiteOrangeFloat"), img("whiteRed"), img("redSneaker")],
    colors: [
      { name: "Ink Black", hex: "#14181F", image: img("whiteOrangeFloat"), sizes: [7,8,9,10,11,12], stock: stockFor([7,8,9,10,11,12]) },
      { name: "Traction Orange", hex: "#FF6B1A", image: img("redSneaker"), sizes: [7,8,9,10,11,12], stock: stockFor([7,8,9,10,11,12]) },
    ],
  },
  {
    id: "p13", slug: "coastway-harbor-slip-men", name: "Harbor Slip-On",
    brand: "Coastway", category: "casual", gender: "men",
    price: 3499, mrp: 3499, rating: 4.4, reviewCount: 48,
    activity: "Walking", material: "Canvas", badges: [],
    description: "A no-lace canvas slip-on with an elastic gusset for a quick in-and-out. Vulcanized outsole for flexibility and grip.",
    images: [img("whiteOnClothing"), img("whiteOrangeBox"), img("pastel")],
    colors: [
      { name: "Haze Grey", hex: "#EEF0F6", image: img("whiteOnClothing"), sizes: [6,7,8,9,10], stock: stockFor([6,7,8,9,10]) },
      { name: "Ink Black", hex: "#14181F", image: img("whiteOrangeBox"), sizes: [6,7,8,9,10], stock: stockFor([6,7,8,9,10]) },
    ],
  },
  {
    id: "p14", slug: "norteno-trail-runner", name: "Trailhead Runner",
    brand: "Norteno", category: "running", gender: "men",
    price: 7299, mrp: 7299, rating: 4.5, reviewCount: 71,
    activity: "Hiking", material: "Mesh", badges: [],
    description: "An aggressive lugged outsole and rock plate protect against loose trail while a wraparound rand shields the toe from roots and stone.",
    images: [img("tealAsphalt"), img("greenBlack"), img("grayRunner")],
    colors: [
      { name: "Cone Orange", hex: "#FF6B1A", image: img("tealAsphalt"), sizes: [7,8,9,10,11], stock: stockFor([7,8,9,10,11]) },
      { name: "Track Navy", hex: "#0B1B3D", image: img("greenBlack"), sizes: [7,8,9,10,11], stock: stockFor([7,8,9,10,11]) },
    ],
  },

  // ---------------- WOMEN ----------------
  {
    id: "p5", slug: "coastway-drift-sandal", name: "Drift Sandal",
    brand: "Coastway", category: "casual", gender: "women",
    price: 2199, mrp: 2199, rating: 4.2, reviewCount: 57,
    activity: "Walking", material: "EVA", badges: [],
    description: "Molded EVA footbed with a contoured arch for all-day wear on wet decks and warm pavement. Quick-dry straps, machine washable.",
    images: [img("pastel"), img("maroonPlimsoll"), img("whiteOrangeBox")],
    colors: [
      { name: "Cone Orange", hex: "#FF6B1A", image: img("whiteOrangeBox"), sizes: [5,6,7,8,9,10], stock: stockFor([5,6,7,8,9,10]) },
      { name: "Blush Pink", hex: "#F2B8C6", image: img("pastel"), sizes: [5,6,7,8,9,10], stock: stockFor([5,6,7,8,9,10]) },
    ],
  },
  {
    id: "p8", slug: "aeropace-pulse-knit", name: "Pulse Knit",
    brand: "Aeropace", category: "sneakers", gender: "women",
    price: 5799, mrp: 5799, rating: 4.3, reviewCount: 96,
    activity: "Gym", material: "Knit", badges: ["new"],
    description: "A sock-like knit trainer for studio classes and everyday errands. Flexible outsole grooves move with the forefoot through lateral steps.",
    images: [img("womenPinkNB"), img("pastel"), img("whiteOnClothing")],
    colors: [
      { name: "Blush Pink", hex: "#F2B8C6", image: img("womenPinkNB"), sizes: [5,6,7,8,9], stock: stockFor([5,6,7,8,9]) },
      { name: "Chalk White", hex: "#FFFFFF", image: img("whiteOnClothing"), sizes: [5,6,7,8,9], stock: stockFor([5,6,7,8,9]) },
    ],
  },
  {
    id: "p12", slug: "marrow-derby-soft", name: "Derby Soft",
    brand: "Marrow", category: "formal", gender: "women",
    price: 7499, mrp: 7499, rating: 4.6, reviewCount: 34,
    activity: "Formal", material: "Leather", badges: ["new"],
    description: "A softer, rounded derby silhouette with cushioned insole for full-day wear in the office.",
    images: [img("blackLeather"), img("blackWhite"), img("brownYellow")],
    colors: [
      { name: "Ink Black", hex: "#14181F", image: img("blackLeather"), sizes: [5,6,7,8,9], stock: stockFor([5,6,7,8,9]) },
      { name: "Chestnut Brown", hex: "#7B4B2A", image: img("brownYellow"), sizes: [5,6,7,8,9], stock: stockFor([5,6,7,8,9]) },
    ],
  },
  {
    id: "p15", slug: "aeropace-flexrun-w", name: "FlexRun W",
    brand: "Aeropace", category: "running", gender: "women",
    price: 6899, mrp: 6899, rating: 4.5, reviewCount: 118,
    activity: "Running", material: "Mesh", badges: ["bestseller"],
    description: "A cushioned neutral trainer tuned for everyday mileage, with a soft knit bootie for a locked-in midfoot fit.",
    images: [img("womenGraySneaker"), img("womenPinkNB"), img("grayRunner")],
    colors: [
      { name: "Slate Grey", hex: "#9AA3B2", image: img("womenGraySneaker"), sizes: [5,6,7,8,9,10], stock: stockFor([5,6,7,8,9,10]) },
      { name: "Blush Pink", hex: "#F2B8C6", image: img("womenPinkNB"), sizes: [5,6,7,8,9,10], stock: stockFor([5,6,7,8,9,10]) },
    ],
  },
  {
    id: "p16", slug: "norteno-city-walk-w", name: "City Walk W",
    brand: "Norteno", category: "sneakers", gender: "women",
    price: 4999, mrp: 5999, rating: 4.4, reviewCount: 82,
    activity: "Walking", material: "Leather", badges: ["sale"],
    description: "A minimal leather sneaker with a cushioned platform sole — dresses up or down for daily wear.",
    images: [img("womenGraySneaker"), img("whiteHighTop"), img("pastel")],
    colors: [
      { name: "Chalk White", hex: "#FFFFFF", image: img("whiteHighTop"), sizes: [5,6,7,8,9], stock: stockFor([5,6,7,8,9]) },
      { name: "Slate Grey", hex: "#9AA3B2", image: img("womenGraySneaker"), sizes: [5,6,7,8,9], stock: stockFor([5,6,7,8,9]) },
    ],
  },
  {
    id: "p17", slug: "coastway-harbor-slip-w", name: "Harbor Slip-On W",
    brand: "Coastway", category: "casual", gender: "women",
    price: 3399, mrp: 3399, rating: 4.3, reviewCount: 41,
    activity: "Walking", material: "Canvas", badges: [],
    description: "A no-lace canvas slip-on with an elastic gusset for a quick in-and-out. Vulcanized outsole for flexibility and grip.",
    images: [img("whiteOnClothing"), img("pastel"), img("whiteOrangeBox")],
    colors: [
      { name: "Blush Pink", hex: "#F2B8C6", image: img("pastel"), sizes: [5,6,7,8,9], stock: stockFor([5,6,7,8,9]) },
      { name: "Haze Grey", hex: "#EEF0F6", image: img("whiteOnClothing"), sizes: [5,6,7,8,9], stock: stockFor([5,6,7,8,9]) },
    ],
  },
  {
    id: "p18", slug: "ridgeline-alpine-boot-w", name: "Alpine Boot W",
    brand: "Ridgeline", category: "boots", gender: "women",
    price: 8999, mrp: 8999, rating: 4.5, reviewCount: 52,
    activity: "Hiking", material: "Leather", badges: [],
    description: "A trimmer-fit hiking boot with the same waterproof leather and lugged outsole as the men's Summit, sized for a narrower heel.",
    images: [img("brownYellow"), img("maroonPlimsoll"), img("blackLeather")],
    colors: [
      { name: "Chestnut Brown", hex: "#7B4B2A", image: img("brownYellow"), sizes: [5,6,7,8,9], stock: stockFor([5,6,7,8,9]) },
      { name: "Track Navy", hex: "#0B1B3D", image: img("maroonPlimsoll"), sizes: [5,6,7,8,9], stock: stockFor([5,6,7,8,9]) },
    ],
  },

  // ---------------- KIDS ----------------
  {
    id: "p19", slug: "aeropace-junior-sprint", name: "Junior Sprint",
    brand: "Aeropace", category: "running", gender: "kids",
    price: 2999, mrp: 3499, rating: 4.7, reviewCount: 76,
    activity: "Running", material: "Mesh", badges: ["bestseller"],
    description: "A grippy, lightweight trainer sized for growing feet, with a wide toe box and a hook-and-loop strap over laces for quick on/off.",
    images: [img("kidsRedTextile"), img("kidsBlackWhite"), img("kidsRedGrass")],
    colors: [
      { name: "Red / White", hex: "#E8402B", image: img("kidsRedTextile"), sizes: [1,2,3,4,5], stock: stockFor([1,2,3,4,5]) },
      { name: "Black / White", hex: "#14181F", image: img("kidsBlackWhite"), sizes: [1,2,3,4,5], stock: stockFor([1,2,3,4,5]) },
    ],
  },
  {
    id: "p20", slug: "norteno-playground-low", name: "Playground Low",
    brand: "Norteno", category: "sneakers", gender: "kids",
    price: 2599, mrp: 2599, rating: 4.6, reviewCount: 64,
    activity: "Walking", material: "Canvas", badges: ["new"],
    description: "A durable everyday sneaker for school and the playground, with a reinforced toe and machine-washable canvas upper.",
    images: [img("kidsBluePink"), img("kidsColorful"), img("kidsBeige")],
    colors: [
      { name: "Blue / Pink", hex: "#5B7FE0", image: img("kidsBluePink"), sizes: [10,11,12,13,1,2], stock: stockFor([10,11,12,13,1,2]) },
      { name: "Beige", hex: "#D8C4A0", image: img("kidsBeige"), sizes: [10,11,12,13,1,2], stock: stockFor([10,11,12,13,1,2]) },
    ],
  },
  {
    id: "p21", slug: "vantek-mini-hoop", name: "Mini Hoop",
    brand: "Vantek", category: "basketball", gender: "kids",
    price: 3299, mrp: 3799, rating: 4.5, reviewCount: 45,
    activity: "Court sports", material: "Synthetic", badges: ["sale"],
    description: "A scaled-down high-top with the same ankle support as our adult basketball line, built for the school court.",
    images: [img("kidsRedGrass"), img("kidsBlackWhite"), img("kidsColorful")],
    colors: [
      { name: "Red / White", hex: "#E8402B", image: img("kidsRedGrass"), sizes: [11,12,13,1,2,3], stock: stockFor([11,12,13,1,2,3]) },
      { name: "Track Navy", hex: "#0B1B3D", image: img("kidsBlackWhite"), sizes: [11,12,13,1,2,3], stock: stockFor([11,12,13,1,2,3]) },
    ],
  },
  {
    id: "p22", slug: "coastway-splash-sandal", name: "Splash Sandal",
    brand: "Coastway", category: "casual", gender: "kids",
    price: 1499, mrp: 1499, rating: 4.4, reviewCount: 38,
    activity: "Walking", material: "EVA", badges: [],
    description: "A quick-dry sport sandal for pool days and summer play, with an adjustable strap and a non-slip tread.",
    images: [img("kidsBeige"), img("kidsColorful"), img("kidsBluePink")],
    colors: [
      { name: "Beige", hex: "#D8C4A0", image: img("kidsBeige"), sizes: [9,10,11,12,13,1], stock: stockFor([9,10,11,12,13,1]) },
      { name: "Blue / Pink", hex: "#5B7FE0", image: img("kidsBluePink"), sizes: [9,10,11,12,13,1], stock: stockFor([9,10,11,12,13,1]) },
    ],
  },
  {
    id: "p23", slug: "aeropace-toddler-first-step", name: "First Step",
    brand: "Aeropace", category: "sneakers", gender: "kids",
    price: 1899, mrp: 1899, rating: 4.8, reviewCount: 29,
    activity: "Walking", material: "Knit", badges: ["new"],
    description: "An extra-flexible sole and a soft knit upper for toddlers just finding their feet — machine washable, easy hook-and-loop closure.",
    images: [img("kidsBlackWhite"), img("kidsRedTextile"), img("kidsBeige")],
    colors: [
      { name: "Black / White", hex: "#14181F", image: img("kidsBlackWhite"), sizes: [4,5,6,7,8], stock: stockFor([4,5,6,7,8]) },
      { name: "Beige", hex: "#D8C4A0", image: img("kidsBeige"), sizes: [4,5,6,7,8], stock: stockFor([4,5,6,7,8]) },
    ],
  },
  {
    id: "p24", slug: "ridgeline-trailkid-boot", name: "Trailkid Boot",
    brand: "Ridgeline", category: "boots", gender: "kids",
    price: 3999, mrp: 4499, rating: 4.5, reviewCount: 22,
    activity: "Hiking", material: "Leather", badges: ["sale"],
    description: "A junior hiking boot with a waterproof leather upper and the same lugged outsole as the adult Summit Boot, scaled down.",
    images: [img("kidsColorful"), img("kidsBluePink"), img("kidsBeige")],
    colors: [
      { name: "Track Navy", hex: "#0B1B3D", image: img("kidsColorful"), sizes: [11,12,13,1,2,3], stock: stockFor([11,12,13,1,2,3]) },
      { name: "Beige", hex: "#D8C4A0", image: img("kidsBeige"), sizes: [11,12,13,1,2,3], stock: stockFor([11,12,13,1,2,3]) },
    ],
  },
];

export const getColorImage = (product, colorIdx = 0) => {
  if (!product) return "";
  const color = product.colors?.[colorIdx];
  if (color?.image) return color.image;
  if (product.images?.[colorIdx]) return product.images[colorIdx];
  return product.images?.[0] || "";
};

export const getProductBySlug = (slug) => products.find((p) => p.slug === slug);
export const getRelated = (product, count = 4) =>
  products.filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)).slice(0, count);
