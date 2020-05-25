const openpgp = require('openpgp');
const fs = require('fs').promises;
const opts = require("./opts");

//hàm ký tên nhận vào partnerCode, timesamp, và request body
async function sign(text){
    const privateKeyArmored = await fs.readFile("./key/private-key-pgp.asc")

    const passphrase = opts.SIGNATURE.PASSPHRASE;

    const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);

    ////Serialize JavaScript object into JSON string
    //const text = JSON.stringify(objCheckSum);

    const { data: cleartext } = await openpgp.sign({
        message: openpgp.message.fromText(text), // CleartextMessage or Message object
        privateKeys: [privateKey]                             // for signing
    });

    //console.log(cleartext);
    return cleartext;
}

//hàm verify cho hàm sign
async function verify(signature){
    const publicKeyArmored = await fs.readFile("./key/pub-key-pgp-nhom7.asc");
    //console.log(cleartext);
    
    ////Serialize JavaScript object into JSON string
    //const text = JSON.stringify(obj)

    const verified = await openpgp.verify({
        message: await openpgp.message.readArmored(signature),
        publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys, // for verification
    });

    const { valid } = verified.signatures[0];
    return valid;
}

module.exports = {
    sign,
    verify
}