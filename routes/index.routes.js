const router = require("express").Router();

// GET home page
router.get("/", (request, response)=>{
    response.render("index");
})

module.exports = router;