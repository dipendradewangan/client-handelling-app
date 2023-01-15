const router = require("express").Router();
const authController = require("../controller/auth.controller");


router.get("/", (req, res)=>{
    authController.logout(req, res);
})

module.exports = router;

