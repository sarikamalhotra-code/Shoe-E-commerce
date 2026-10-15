import { shoeImg } from "./shoeImages";

export const mockOrders = [
  {
    id: "SS482913", date: "2026-08-12", status: "Delivered", total: 6499,
    items: [{ name: "Vector Runner", color: "Chalk White", size: 9, qty: 1, image: shoeImg("heroWhite", 200, 200) }],
  },
  {
    id: "SS471820", date: "2026-07-29", status: "Shipped", total: 12798,
    items: [
      { name: "Court Classic", color: "Chalk White", size: 8, qty: 1, image: shoeImg("whiteHighTop", 200, 200) },
      { name: "Drift Sandal", color: "Cone Orange", size: 8, qty: 1, image: shoeImg("pastel", 200, 200) },
    ],
  },
  {
    id: "SS460044", date: "2026-06-03", status: "Return Requested", total: 9499,
    items: [{ name: "Summit Boot", color: "Track Navy", size: 10, qty: 1, image: shoeImg("brownYellow", 200, 200) }],
  },
];
