const tokenServices = require("../services/token.services");
const databaseServices = require("../services/database.services");

const createUser = async (req, res) => {
    const token = tokenServices.verifyToken(req);
    if (token.isVerified) {
        const data = token.data;
        try {
            const userRes = await databaseServices.createRecord(data, 'user');
            res.status(200).json({
                isUserCreated : true,
                message : 'User created!',
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



module.exports = {
    createUser: createUser
}