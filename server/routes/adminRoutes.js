const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getDashboard,
  getCatalog,
  getResources,
  createResource,
  updateResource,
  deleteResource,
} = require("../controllers/adminController");
const { authMiddleware, requireAdmin } = require("../middleware/authMiddleware");
const { importTimetable } = require("../controllers/timetableImportController");
const { importStudents } = require("../controllers/studentImportController");

router.post("/login", loginAdmin);

router.use(authMiddleware, requireAdmin);

router.get("/dashboard", getDashboard);
router.get("/catalog", getCatalog);
router.post("/timetable/import", importTimetable);
router.post("/students/import", importStudents);
router.get("/admins", getAdmins);
router.post("/admins", createAdmin);
router.put("/admins/:id", updateAdmin);
router.delete("/admins/:id", deleteAdmin);
router.route("/:type")
  .get(getResources)
  .post(createResource);
router.route("/:type/:id")
  .put(updateResource)
  .delete(deleteResource);

module.exports = router;
