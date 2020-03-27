const NodeRSA  = require('node-rsa');
const fs = require('fs').promises;

async function sign(partnerCode, timesamp, reqBody){
    const privateKey = await fs.readFile("../Database/private-rsa.pem");
    const key = new NodeRSA();
    key.importKey(privateKey, "private");
    
    const checksum = {
        partnerCode,
        timesamp,
        reqBody
    }

    //Object to JSON
    const text = JSON.stringify(checksum);

    return key.sign(text);
}


//không cần sử dụng
async function verifyChecksum(checksum, partnerCode, timesamp, reqBody){
    const publicKey = await fs.readFile("../Database/public-rsa.pem");
    const key = new NodeRSA();
    key.importKey(publicKey, "public");

    const obj = {
        partnerCode,
        timesamp,
        reqBody
    }

    //Object to JSON
    const text = JSON.stringify(obj);

    return key.verify(text, checksum);
}

module.exports = {
    sign,
    verifyChecksum
}