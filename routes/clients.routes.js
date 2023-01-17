const router = require("express").Router();


router.get("/", (req, res)=>{
    res.render("clients");
})

module.exports = router;