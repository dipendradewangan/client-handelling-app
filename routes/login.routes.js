const router = require("express").Router();
const tokenServices = require("../services/token.services");
const httpServices = require('../services/http.services');

router.post("/", async (req, res)=>{
    const expiresIn = 120;
    const token = await tokenServices.createToken(req, expiresIn);

    // requesting company api for gettring user id 
    
    const compRes = await httpServices.getRequest({
        endpoint : req.get("origin"),
        api : "/api/private/company",
        data : token,
    });
    console.log(compRes.body)
    if(compRes.body.isCompanyExist){
        const id = compRes.body.data[0]._id
        console.log(id);
    }
    else{

    }

})

module.exports = router;