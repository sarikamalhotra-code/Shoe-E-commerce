// Real product photography sourced from Unsplash (free license, no attribution required).
// Helper builds a consistently-cropped square (or custom ratio) delivery URL per photo.
const unsplash = (id, w = 900, h = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export const shoePhotoIds = {
  heroWhite: "1615743472612-93b21e520fad",       // white nike shoe, clean white bg
  redSneaker: "1542291026-7eec264c27ff",          // red sneaker
  greenBlack: "1606107557195-0e29a4b5b4aa",       // green/black athletic shoe
  whiteOrangeBox: "1560769629-975ec94e6a86",      // white/orange shoes on white box
  pastel: "1595950653106-6c9ebd614d3a",           // pastel sneakers on geometric surface
  maroonPlimsoll: "1525966222134-fcfa99b8ae77",   // maroon plimsoll on yellow
  whiteRed: "1600185365483-26d7a4cc7519",         // white/red athletic shoe
  grayRunner: "1491553895911-0055eca6402d",       // gray running shoe
  blackLeather: "1543508282-6319a3e2621f",        // black leather sneaker, white desk
  whiteOnClothing: "1600269452121-4f2416e55c28",  // white sneaker on athletic clothing
  brownYellow: "1549298916-b41d501d3772",         // brown sneaker on yellow textile
  whiteOrangeFloat: "1600185365926-3a2ce3cdb9eb", // white/orange sneaker floating
  whiteHighTop: "1512374382149-233c42b6a83b",     // pair of white high-tops
  blackWhite: "1605348532760-6753d2c43329",       // black/white athletic shoes
  tealAsphalt: "1595341888016-a392ef81b7de",      // white/teal/orange sneaker on asphalt
  // Women's
  womenPinkNB: "1551107696-a4b0c5a0d9a2",         // pink/grey/white New Balance sneaker
  womenGraySneaker: "1620114884229-65d21f8c9423", // gray/white nike low-top sneaker
  // Kids'
  kidsRedGrass: "1605523741177-cd660595c2cf",     // white/red nike basketball shoes on grass
  kidsRedTextile: "1584564515943-b54cbb61836b",   // white/red nike sneakers on white textile
  kidsBlackWhite: "1605382165091-443eff32caf5",   // black/white adidas kids sneakers
  kidsBeige: "1552912276-56ef47874741",           // beige rubber shoes
  kidsBluePink: "1624958797025-b119e2fa2b53",     // blue/pink nike sneakers
  kidsColorful: "1742390671647-bc9c5399fdf3",     // colorful sneaker outdoors
};

export const shoeImg = (key, w, h) => unsplash(shoePhotoIds[key], w, h);
