let nodemailer = require('nodemailer');
const crypto = require('crypto');

const ENCRYPTION_KEY = "DwNfv0unVZPZu9hepdMpbBgwXTZAMf5R"; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16



const transporter = nodemailer.createTransport({
    host: 'smtp.hostname.com',
    port: 465,
    secure: true,
    auth: {
        user: 'username',
        pass: 'Password'
    }
});

// send mail with defined transport object
function sendEmail(recipient, subject, body) {

    let mailOptions = {
        from: '"Support" <Support@intruity.com>', // sender address
        to: recipient, // list of receivers
        subject: subject, // Subject line
        html: body // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
}


let generatePassword = function() {
    let length = 16,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};




let checkNull = function(value) {
    if(value === '' || value === undefined){
        return null
    } else{
        return value;
    }
};

'use strict';

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = new Buffer(textParts.shift(), 'hex');
    let encryptedText = new Buffer(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

function doesMatch(password) {
    if(password.length > 35){
        return password;
    } else{
        return encrypt(password);
    }
}

function getDate() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}


module.exports = { decrypt, encrypt, checkNull, doesMatch, sendEmail, generatePassword, getDate };