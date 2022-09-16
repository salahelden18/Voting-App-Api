const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");

router.post("/signup", userController.signup);

router.post("/signin", userController.signin);

router.get(
  "/candidateList",
  userController.protect,
  userController.getCandidatesList
);

router.get("/getMe", userController.protect, userController.getUser);

router.patch(
  "/updateUser",
  userController.protect,
  userController.restrictTo("user", "admin"),
  userController.updateUser
);

router.patch(
  "/updateUserById/:id",
  userController.protect,
  userController.restrictTo("user", "admin"),
  userController.updateUserById
);

router.delete(
  "/deleteUser/:id",
  userController.protect,
  userController.restrictTo("admin"),
  userController.deleteUser
);

module.exports = router;
