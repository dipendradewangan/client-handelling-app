const tokenServices = require("../services/token.services");
const databaseServices = require("../services/database.services");

const createUser = async (req, res) => {
    const token = tokenServices.verifyToken(req);
    if (token.isVerified) {
        const data = token.data;
        
        try {
            // create token for autologin at the time of signup code start
            
            const uidJson = {
                uid : token.data.uid
            }
            const endpoint = req.get("origin") || "http://"+req.get("host");
            const exipiresIn = 86400;
            const storeTokenInDb = {
                body : uidJson,
                endpoint : endpoint,
                api : req.originalUrl,
                iss : endpoint+req.originalUrl
            } 
            
            
            const newToken = await tokenServices.createCustomToken(storeTokenInDb, exipiresIn);
            data["token"] = newToken;
            data["expiresIn"] = exipiresIn;
            data["isLogged"] = true;

            // create token for autologin at the time of signup code end
            const userRes = await databaseServices.createRecord(data, 'user');
            res.status(200).json({
                isUserCreated : true,
                message : 'User created!',
                token : newToken,
                data : userRes
            })
        } catch (err) {
            res.status(409).json({
                isUserCreated : false,
                message : 'Internal server error!',
            })
        }

    } else {
        res.status(401).json({
            message: "permission denied"
        })
    }
}



const getUserPassword = async (req, res)=>{
    const tokenData = tokenServices.verifyToken(req);  
    if(tokenData.isVerified){
        const query = tokenData.data;
        const passRes = await databaseServices.getRecordByQuery(query,"user")
        if(passRes.length > 0){
            res.status(200).json({
                isCompanyExist : true,
                message : "company found!",
                data : passRes
            })
        }
        else{
            res.status(404).json({
                isCompanyExist : false,
                message : "company not found!"

            })
        }
    } 
    else{
        res.status(401).json({
            message : "permission denied!"
        })
    }
}

const createLog = async (req, res)=>{
    const tokenData = await tokenServices.verifyToken(req);
    if(tokenData.isVerified){
        const query = {
            uid : tokenData.data.uid
        }

        const data = {
            token : req.body.token,
            updatedAt : Date.now(),
            isLogged : true,
            expiresIn : 86400
        }
        
        const updatedData = await databaseServices.updateRecordByQuery(query, 'user', data);
        res.status(201).json({
            message : "Update Success!"
        })
        
    }
    else{
        res.status(401).json({
            message : "permission denied!"
        })
    }
}




module.exports = {
    createUser: createUser,
    getUserPassword : getUserPassword,
    createLog : createLog
}