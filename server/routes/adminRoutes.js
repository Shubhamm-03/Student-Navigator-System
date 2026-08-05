const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  getDashboard,
  getCatalog,
  getResources,
  createResource,
  updateResource,
  deleteResource,
} = require("../controllers/adminController");
const { authMiddleware, requireAdmin } = require("../middleware/authMiddleware");

router.post("/login", loginAdmin);

router.use(authMiddleware, requireAdmin);

router.get("/dashboard", getDashboard);
router.get("/catalog", getCatalog);
router.route("/:type")
  .get(getResources)
  .post(createResource);
router.route("/:type/:id")
  .put(updateResource)
  .delete(deleteResource);

module.exports = router;
