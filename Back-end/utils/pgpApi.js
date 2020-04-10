const openpgp = require('openpgp');
const fs = require('fs').promises;
const opts = require("./opts");

//hàm ký tên nhận vào partnerCode, timesamp, và request body
async function sign(objCheckSum){
    const privateKeyArmored = await fs.readFile("../Database/private-key-pgp.asc")

    const passphrase = opts.SIGNATURE.PASSPHRASE;

    const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);

    //Serialize JavaScript object into JSON string
    const text = JSON.stringify(objCheckSum);

    const { signature: detachedSignature } = await openpgp.sign({
        message: openpgp.message.fromText(text), // CleartextMessage or Message object
        privateKeys: [privateKey],                             // for signing
        detached: true
    });

    //console.log(detachedSignature);
    return detachedSignature;
}

//hàm verify cho hàm sign
async function verify(detachedSignature, obj){
    const publicKeyArmored = await fs.readFile("../Database/pub-key-pgp.asc");
    //console.log(publicKeyArmored);
    
    // const obj = {
    //     partnerCode: partnerCode,
    //     timesamp: date,
    //     secretKey: opts.SIGNATURE.SECRET_KEY,
    //     reqBody
    // }
    //Serialize JavaScript object into JSON string
    const text = JSON.stringify(obj)

    const verified = await openpgp.verify({
        message: openpgp.message.fromText(text), 
        signature: await openpgp.message.readArmored(detachedSignature),           // parse armored message
        publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys, // for verification
    });

    const { valid } = verified.signatures[0];
    return valid;
}

module.exports = {
    sign,
    verify
}