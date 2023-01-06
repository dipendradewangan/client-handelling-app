const mongo = require("mongoose");
const {Schema} = mongo;
const bcryptServices = require("../services/bcrypt.services");

const userSchema = new Schema({
    uid : {
        type : String,
        unique : true
    },
    password : {
        type : String,
        required : [true, "Password field is required"]
    },
    token: {
        type : String
    },
    expiresIn : {
        type : Number
    },
    isLogged : {
        type : Boolean
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }

})



// encrypted password
userSchema.pre("save", async function(next){
    const password = this.password.toString();
    this.password = await bcryptServices.encrypt(password);
    next();
})

module.exports = mongo.model("User", userSchema);






