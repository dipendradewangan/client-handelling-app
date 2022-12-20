const companySchema = require("../model/company.model");
const userSchema = require("../model/user.model");
const mongo = require("mongoose");
const url = "mongodb://127.0.0.1:27017/cloneFrontwap";
mongo.set('strictQuery', false);
mongo.connect(url).then(()=>{
    console.log("Database successfully connected");
}).catch((err)=>{
    console.log(err);
})


const schemaList = {
    user : userSchema,
    company : companySchema
}



// create
const createRecord = async (data, schemaName)=>{
    const Schema = schemaList[schemaName];
    const collection = new Schema(data);
    const dataRes = await collection.save();
    return dataRes;
}


const getRecordByQuery = async (query,schemaName)=>{
    const Schema = schemaList[schemaName];
    const collection = await Schema.find(query);
    return collection;
}

module.exports = {
    createRecord : createRecord,
    getRecordByQuery : getRecordByQuery
}