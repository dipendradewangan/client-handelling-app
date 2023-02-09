const mongo = require("mongoose");
const {Schema} = mongo;


const clientsSchema = new Schema({
    companyId : String,
    clientName : String,
    clientEmail : {
        type : String
    },
    clientCountry: String,
    clientMobile : Number,
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
})


clientsSchema.pre("save",async function(next){
    console.log(this)
    const query = {
        clientEmail : this.clientEmail
    }
    const length = await mongo.model("Client").countDocuments(query);
    console.log(length);
    if(length > 0){
        next("Client allready existed!")
    }
    else{
        next()
    }
})


module.exports = mongo.model("Client", clientsSchema);