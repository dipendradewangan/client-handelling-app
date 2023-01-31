const tokenServices = require("../services/token.services");
const create = async (req, res) => {
    const tokenData = tokenServices.verifyToken(req);

    if(tokenData.isVerified){
        const data = req.body;
        console.log(tokenData);
        data['companyId'] = tokenData.data.uid;
        res.status(200).json(data);
    }
    else{
        res.status(401).json({
            message : "Unouthenticated Token!"
        })
    }

}

module.exports = {
    create: create
}