const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const issServices = require("./iss.services");


// create token
const create = async (req, expiresIn) => {
    const formData = req.body;
    const endpoint = req.get("origin");
    const api = req.originalUrl;
    const iss = endpoint + api;
    const token = await jwt.sign({
            iss: iss,
            data: formData
        },
        secretKey, {
            expiresIn: expiresIn
        }
    )
    return token;
}


// create custom token
const createCustomToken = async (data, expiresIn) => {
    const formdata = data.body;
    const endpoint = data.endpoint;
    const api = data.api;
    const iss = data.iss;

    const token = await jwt.sign({
            data: formdata,
            iss: iss
        },
        secretKey,
        {
            expiresIn: expiresIn
        }
    )
    return token;
}


// verify token
const verify = (req) => {
    let token = "";
    if(req.method == "GET"){
        if(req.headers['x-auth-token']){
            token = req.headers['x-auth-token'];
        }
        else{
            token = req.cookies.authToken;
        }
        
    }
    else{
        token = req.body.token;
    }
    if (token) {
        try {
            const tokenData = jwt.verify(token, secretKey);
            const requestCommingFrom = tokenData.iss;
            if (issServices.indexOf(requestCommingFrom) != -1) {
                return {
                    isVerified: true,
                    data: tokenData.data
                };
            }
        } catch (err) {
            return {
                isVerified: false
            };
        }
    } else {
        return {
            isVerified: false
        };
    }
}


module.exports = {
    createToken: create,
    createCustomToken: createCustomToken,
    verifyToken: verify
}