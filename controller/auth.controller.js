const tokenServices = require("../services/token.services");
const databaseServices = require("../services/database.services");

const refreshToken = async (uid, req)=>{
    
    const endpoint = req.get("origin") || "http://"+req.get("host");
    const tokenOption = {
        body : uid,
        endpoint : endpoint,
        api : req.originalUrl,
        iss : endpoint+req.originalUrl
    
    }
    const expiresIn = 120;
    const newToken = await tokenServices.createCustomToken(tokenOption,expiresIn);

    const updateTokenInDb = {
        token : newToken,
        expiresIn : expiresIn,
        updatedAt : Date.now()
    }

    databaseServices.updateRecordByQuery(uid, "user", updateTokenInDb);
    return newToken;

}


const checkUserLog = async (req, res) => {
    const tokenData = await tokenServices.verifyToken(req);
    if (tokenData.isVerified) {
        const query = {
            token: req.cookies.authToken,
            isLogged: true
        }


        const userData = await databaseServices.getRecordByQuery(query, 'user')
        if (userData.length > 0) {

            const newToken = await refreshToken(tokenData.data, req);

            res.cookie("authToken", newToken, {maxAge : (120*1000)});
            
            return true;

        } else {
            return false;
        }
    } else {
        return false;
    }
}


const logout = async (req, res)=>{
    // to verify token
    const tokenData = await tokenServices.verifyToken(req);
    if(tokenData.isVerified){

        // preparing data for update
        const updateData = {
            isLogged : false,
            updatedAt : Date.now()
        }

        // finding the uid for query
        const query = {
            uid : tokenData.data.uid
        }

        
        const updateRes = await databaseServices.updateRecordByQuery(query,"user",updateData);

        // if any modified data in response we done have successfully update in data base and successfully logout
        if(updateRes.modifiedCount){
            res.clearCookie("authToken");
            res.redirect("/");
        }
        else{
            res.redirect("/profile");
        }
        
    }
    else{
        res.status(401).json({
            message : "permission denied!"
        })
    }
} 

module.exports = {
    checkUserLog: checkUserLog,
    logout: logout
}