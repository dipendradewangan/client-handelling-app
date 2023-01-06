const tokenServices = require("../services/token.services");
const databaseServices = require("../services/database.services");

const checkUserLog = async (req)=>{
    const tokenData = await tokenServices.verifyToken(req);
    console.log(tokenData);
    if(tokenData.isVerified){
        const query = {
            token : req.cookies.authToken,
            isLogged : true
        }

        const userData =  await databaseServices.getRecordByQuery(query, 'user')
        if(userData.length>0){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}

module.exports = {
    checkUserLog : checkUserLog
}