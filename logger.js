const { createLogger, format, transports } = require("winston");
const https = require('https');
const fs = require('fs')

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};
 
const logger = createLogger({
    level: "info",
    levels: logLevels,
    format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});

logger.info("Working fine")
logger.error("something went wrong")



const outputLog = fs.createWriteStream('./outputLog.log');
const errorsLog = fs.createWriteStream('./errorsLog.log');


const consoler = new console.Console(outputLog, errorsLog);



let request = https.get('https://jsonplaceholder.typicode.com/todos/1', (res) => { 

    if (res.statusCode !== 200) {
        console.error(`Did not get an OK from the server. Code: ${res.statusCode}`);
        logger.error("error")
        consoler.error(new Error('error'));
        res.resume();
        return;
      }
    let data = '';

    res.on('data', (chunk) => {

      
      data += chunk;
    });
  
    res.on('close', () => {
      console.log('Retrieved all data');
      console.log(JSON.parse(data));
      logger.info(data)
      consoler.log(data);
    });

    
});

