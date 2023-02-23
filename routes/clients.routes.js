const router = require("express").Router();
const clientController = require("../controller/clients.controller");


router.get("/", (req, res)=>{
    res.render("clients");
})

router.get("/count-all", (req, res)=>{
    clientController.countClients(req, res);
})

router.post("/", (req, res)=>{
    clientController.create(req, res);
})



module.exports = router;