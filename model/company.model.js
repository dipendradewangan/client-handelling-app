const mongo = require("mongoose");
const {Schema} = mongo;


const companySchema = new Schema({
    company_name : {
        type : String,
        unique : true
    },
    email : {
        type : String,
        unique : true
    },
    mobile : {
        type : Number
    },
    emailVerified : {
        type : Boolean,
        default : false
    },
    mobileVerified : {
        type : Boolean,
        default : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
});


// middleware for company name duplicate entry validation
companySchema.pre("save", async function(next){
    const query = {
        company_name : this.company_name 
    };
    
    const length = await mongo.model("Company").countDocuments(query);
    if(length > 0){
        const compError = {
            label : "Company name already exists!",
            field : "company_name"
        }
        throw next(compError)
    }
    else{
        next()
    }
})



// middleware for company name duplicate entry validation

companySchema.pre("save", async function(next){
    const query = {
        email : this.email
    }

    const length = await mongo.model("Company").countDocuments(query)
    if(length > 0){
        const compError = {
            label : "Email id already exists!",
            field : "company_email"
        }
        throw next(compError);
    }
    else{
        next();
    }
})


module.exports = mongo.model("Company", companySchema);