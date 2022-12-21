const bcrypt= require("bcrypt");


const encrypt = async (data)=>{
    const encrypted = await bcrypt.hash(data,12);
    return encrypted;
}

const decrypt = async (stored, typed)=>{
    const decrypted = await bcrypt.compare(typed, stored);
    return decrypted;
}


module.exports = {
    encrypt : encrypt,
    decrypt : decrypt
}