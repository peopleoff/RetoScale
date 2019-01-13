const winston = require('winston');
require('winston-loggly-bulk');
 
 winston.add(winston.transports.Loggly, {
    token: "90e67ed3-5a11-411f-bb0e-a4391113fe86",
    subdomain: "ruslanbelyy",
    tags: ["Winston-NodeJS"],
    json:true
});

module.exports = {
    sendLog(type, msg){
        winston.log(type,msg);
    }
}