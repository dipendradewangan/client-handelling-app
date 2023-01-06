const router = require("express").Router();
const tokenServices = require("../services/token.services");
const httpServices = require('../services/http.services');
const bcryptServices = require("../services/bcrypt.services");

router.post("/", async (req, res) => {
    const expiresIn = 120;
    const token = await tokenServices.createToken(req, expiresIn);

    // requesting company api for gettring user id 

    const compRes = await httpServices.getRequest({
        endpoint: req.get("origin"),
        api: "/api/private/company",
        data: token,
    });

    // check company data response
    if (compRes.body.isCompanyExist) {
        const query = {
            body: {
                uid: compRes.body.data._id
            },
            endpoint: req.get("origin"),
            api: "/api/private/user",
            iss: req.get("origin") + req.originalUrl
        }
        const uidToken = await tokenServices.createCustomToken(query, expiresIn);
        
        const passwordRes = await httpServices.getRequest({
            endpoint: req.get("origin"),
            api: "/api/private/user",
            data: uidToken
        });
        
        if(passwordRes.body.isCompanyExist){
            const storedPassword = passwordRes.body.data[0].password;
            const typedPassword = req.body.login_password;
            const decryptedPassword = await bcryptServices.decrypt(storedPassword, typedPassword);
            if(decryptedPassword){
                const secondsIn7days =  (60*60*24*7) // (make for only days)
                const authToken = await tokenServices.createCustomToken(query, secondsIn7days, {maxAge : secondsIn7days});

                // update token in database
                const userUpdateRes = await httpServices.putRequest({
                    endpoint : req.get("origin"),
                    api : "/api/private/user",
                    data : authToken
                });

                console.log(userUpdateRes.body);



                res.cookie("authToken",authToken);
                res.status(200).json({
                    isLogged : true,
                    message : "success"
                });

            }
            else{
                res.status(401).json({
                    isLogged : false,
                    message : "wrong password!"
                })
            }
        }
        else{
            res.status(passwordRes.status);
            res.json(passwordRes.body);
        }
    } else {
        res.status(compRes.status);
        res.json(compRes.body);
    }

})

module.exports = router;