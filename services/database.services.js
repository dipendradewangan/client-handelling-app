const companySchema = require("../model/company.model");
const userSchema = require("../model/user.model");
const clientSchema = require("../model/clients.model");


const mongo = require("mongoose");
const url = "mongodb+srv://dippu:dippu@cluster0.pe8vd6t.mongodb.net/cloneFrontwap";

mongo.set('strictQuery', false);

mongo.connect(url).then(()=>{
    console.log("Database successfully connected");
}).catch((err)=>{
    console.log(err);
})


// dynamic schema selection json data 
const schemaList = {
    user : userSchema,
    company : companySchema,
    client : clientSchema
}



// create
const createRecord = async (data, schemaName)=>{
    const Schema = schemaList[schemaName];
    const collection = new Schema(data);
    const dataRes = await collection.save();
    return dataRes;
}

// get
const getRecordByQuery = async (query,schemaName)=>{
    const Schema = schemaList[schemaName];
    const collection = await Schema.find(query);
    return collection;
}


// get total count in db
const countData = async (schemaName)=>{
    const schema = schemaList[schemaName];
    const dataRes = await schema.countDocuments();
    return dataRes;
}



// update
const updateRecordByQuery = async (query, schemaName, data)=>{
    const Schema = schemaList[schemaName];
    const collection = await Schema.updateOne(query, data);
    return collection;
}

module.exports = {
    createRecord : createRecord,
    getRecordByQuery : getRecordByQuery,
    updateRecordByQuery : updateRecordByQuery,
    countData : countData
}