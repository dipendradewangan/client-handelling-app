const router = require("express").Router();
const tokenServices = require("../services/token.services");
const httpServices = require("../services/http.services");


router.post("/", async (req, res) => {
    const expiresIn = 120;
    console.log(req.get("origin"));
    const token = await tokenServices.createToken(req, expiresIn);

    // requesting compnay api
    const companyRes = await httpServices.postRequest({
        endpoint: req.get("origin"),
        api: "/api/private/company",
        data: token
    });

    // now requesting user api
    if (companyRes.body.isCompanyCreated) {
        // prepairing data to create user token
        const newUser = {
            body: {
                uid: companyRes.body.data._id,
                password: req.body.password
            },
            endpoint : req.get("origin"),
            api : req.originalUrl,
            iss : req.get("origin")+req.originalUrl
        }
        
        // creating token for user
        const userToken = await tokenServices.createCustomToken(newUser, expiresIn);
        
        // requesting http request for user 
        const userRes = await httpServices.postRequest({
            endpoint : req.get("origin"),
            api : "/api/private/user",
            data : userToken
        });

        res.json(userRes);
    } else {
        res.json(companyRes);
    }


})


module.exports = router;