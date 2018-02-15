var cron = require("cron"),
    CronJob = require('cron').CronJob,
    request = require('request'),
    os = require('os');

require('dotenv').config()

// Cron
exports.cronConfig = new CronJob('0 0 */12 * * *', () => {//0 * * * * *
  var hostname

  //hostname defintion
  if(os.hostname() === process.env.LOCALHOST_ONE || os.hostname() === process.env.LOCALHOST_TWO){
    hostname = "http://localhost:3000";
  } else {
    hostname = "https://vtt-bzh.herokuapp.com";
  }

  //url trigger
  request(hostname + "/scrapper-vtt", (err, res, body) => {
    if (err) { return console.log(err); } else { console.log('cron launch')}
  });

}, null, true, 'Europe/Paris');