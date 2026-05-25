const express = require("express");

const { analyzeScan, getScanHistory } = require("../controllers/scanController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze", authMiddleware, analyzeScan);
router.get("/history", authMiddleware, getScanHistory);

module.exports = router;
