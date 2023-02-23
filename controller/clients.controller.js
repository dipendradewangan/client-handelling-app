const tokenServices = require("../services/token.services");
const dbServices = require("../services/database.services");

const create = async (req, res) => {
    // req contains default request by node
    const tokenData = tokenServices.verifyToken(req);

    if (tokenData.isVerified) {
        const data = req.body;

        // company id must for saperate clients according to service company
        data["companyId"] = tokenData.data.uid;

        try {
            const clientRecord = await dbServices.createRecord(data, "client");
            res.status(200).json({
                message: "Record created!",
                data: clientRecord,
            });
        } catch (error) {
            res.status(409).json({
                message: "Record not created!",
                data: error,
            });
        }
    } else {
        res.status(401).json({
            message: "Unouthenticated Token!",
        });
    }
};

const countClients = async (req, res) => { 
    const tokenData = tokenServices.verifyToken(req);

    if(tokenData.isVerified){

        // create function for get total data in db
        const dataRes = await dbServices.countData('client');
        res.status(200).json({
            data : dataRes
        })
    }
    else{
        res.status(401).json({
            message : "Unauthenticated Token!"
        })
    }
};

module.exports = {
    create: create,
    countClients: countClients,
};
