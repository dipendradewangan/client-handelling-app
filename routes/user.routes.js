const router = require("express").Router();
const userController = require("../controller/user.controller");


router.post("/", (req, res)=>{
    userController.createUser(req, res);
})

module.exports = router;