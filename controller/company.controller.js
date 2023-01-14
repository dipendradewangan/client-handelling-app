const tokenServices = require("../services/token.services");
const databaseServices = require("../services/database.services");



createCompany = async (req, res) => {
    const token = tokenServices.verifyToken(req);

    if (token.isVerified) {
        const data = token.data;

        // now you can store the data
        try {
            const dataRes = await databaseServices.createRecord(data, "company");
            res.status(200).json({
                isCompanyCreated : true,
                message : "Comapny created!",
                data : dataRes
            })
        } catch (err) {
            res.status(409);
            res.json({
                isCompanyCreated: false,
                message: err
            })
        }
    } else {
        res.status(401).json({
            message: "permission denied"
        })
    }
}


getCompanyId = async (req,res)=>{
    const tokenData = tokenServices.verifyToken(req)
    if(tokenData.isVerified){
        const email = tokenData.data.login_email;

        const collection = await databaseServices.getRecordByQuery({email : email}, "company");

        if(collection.length > 0){
            res.status(200).json({
                isCompanyExist : true,
                message : "Company found!",
                data : collection[0]
            })
        }
        else{
            res.status(404).json({
                isCompanyExist : false,
                message : "Company not found!"
            })
        }
    }
    else{
        res.status(401).json({
            message : "permission denied!"
        })
    }
}

module.exports = {
    createCompany: createCompany,
    getCompanyId : getCompanyId
}