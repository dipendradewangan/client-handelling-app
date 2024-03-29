const router = require("express").Router();
const tokenServices = require("../services/token.services");
const httpServices = require("../services/http.services");


router.post("/", async (req, res) => {
    const expiresIn = 120;
    const token = await tokenServices.createToken(req, expiresIn);

    // requesting compnay api


    const companyRes = await httpServices.postRequest({
        endpoint: req.get("origin"),
        api: "/api/private/company",
        data: token
    });

    console.log(companyRes.body);

    // now requesting user api
    if (companyRes.body.isCompanyCreated) {
        // prepairing data to create user token
        const newUser = {
            body: {
                uid: companyRes.body.data._id,
                password: req.body.password
            },
            endpoint: req.get("origin"),
            api: req.originalUrl,
            iss: req.get("origin") + req.originalUrl
        }

        // creating token for user
        const userToken = await tokenServices.createCustomToken(newUser, expiresIn);

        // requesting http request for user 

        const userRes = await httpServices.postRequest({
            endpoint: req.get("origin"),
            api: "/api/private/user",
            data: userToken
        });

        // set authToken on browser during signup user 
        res.cookie("authToken", userRes.body.token, {
            maxAge: (86400 * 1000)
        })

        
        res.status(userRes.status);
        res.json(userRes.body);
    }
    else {
        res.status(companyRes.status);
        res.json(companyRes.body);
        
    }



})


module.exports = router;