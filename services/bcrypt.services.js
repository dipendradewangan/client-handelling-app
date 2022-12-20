const bcrypt= require("bcrypt");


const encrypt = async (data)=>{
    const encrypted = await bcrypt.hash(data,12);
    return encrypted;
}

const decrypt = ()=>{}


module.exports = {
    encrypt : encrypt,
    decrypt : decrypt
}