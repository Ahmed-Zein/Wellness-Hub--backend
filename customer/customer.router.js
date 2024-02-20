const express = require("express");

const { register, login } = require("./customer.controller");
const { authenticateToken } = require("../common/jwt");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/test", authenticateToken, (req, res) => {
  res.send("sucess");
});
module.exports = router;
