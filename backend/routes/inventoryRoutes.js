import express from "express";
import { updateInventory, getInventoryHistory, getLowStockProducts } from "../controllers/inventoryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/", protect, adminOnly, updateInventory);
router.get("/history", protect, adminOnly, getInventoryHistory);
router.get("/low-stock", protect, adminOnly, getLowStockProducts);

export default router;